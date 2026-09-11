// ==========================================================================
// VOLVITECH HOSPITALITY OS — AUTH & WORKSPACES CONTROLLER (TIER 2: API LAYER)
// ==========================================================================
import { Router } from 'express';
import { query } from '../db/pool.js';

export const authRouter = Router();

// Helper to fetch live badge indicators for workspaces
async function getWorkspaceLiveIndicators() {
  const [arrivalsRes, roomsRes] = await Promise.all([
    query(`SELECT COUNT(*) as count FROM reservations WHERE check_in_date = CURRENT_DATE AND status = 'CONFIRMED'`),
    query(`SELECT 
             COUNT(*) FILTER (WHERE operational_status = 'VACANT_DIRTY') as dirty_rooms,
             COUNT(*) FILTER (WHERE operational_status = 'INSPECTION_REQUIRED') as inspect_rooms,
             COUNT(*) FILTER (WHERE operational_status = 'OUT_OF_ORDER') as ooo_rooms,
             COUNT(*) FILTER (WHERE operational_status = 'OCCUPIED') as occupied_rooms
           FROM rooms WHERE is_active = true`),
  ]);

  const arrivalsAttention = parseInt(arrivalsRes.rows[0]?.count, 10) || 0;
  const dirtyRooms = parseInt(roomsRes.rows[0]?.dirty_rooms, 10) || 0;
  const inspectRooms = parseInt(roomsRes.rows[0]?.inspect_rooms, 10) || 0;
  const pendingHousekeeping = dirtyRooms + inspectRooms;
  const oooRooms = parseInt(roomsRes.rows[0]?.ooo_rooms, 10) || 0;

  return {
    arrivalsAttention: arrivalsAttention > 0 ? `${arrivalsAttention} pending check-in` : null,
    pendingRooms: pendingHousekeeping > 0 ? `${pendingHousekeeping} rooms to clean` : 'All rooms clean',
    openOrders: oooRooms > 0 ? `${oooRooms} rooms OOO` : 'No urgent alerts',
    activeOrders: '3 kitchen orders',
    lowStock: '2 low stock items',
    pendingPOs: '1 PO pending approval',
  };
}

// GET /api/auth/demo-users - Pre-configured demo personas for fast enterprise testing
authRouter.get('/demo-users', async (_req, res) => {
  try {
    const usersRes = await query(`
      SELECT 
        u.id, 
        u.username, 
        u.email, 
        u.full_name, 
        u.role_id, 
        u.avatar_initials, 
        r.name as role_name, 
        r.description as role_description
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.is_active = true
      ORDER BY 
        CASE u.role_id
          WHEN 'FRONT_DESK_AGENT' THEN 1
          WHEN 'GENERAL_MANAGER' THEN 2
          WHEN 'ADMIN' THEN 3
          WHEN 'HOUSEKEEPING_SUPERVISOR' THEN 4
          WHEN 'STORE_MANAGER' THEN 5
          WHEN 'FB_CHEF' THEN 6
          ELSE 7
        END ASC
    `);

    res.json({ success: true, data: usersRes.rows });
  } catch (err: any) {
    console.error('[Auth.getDemoUsers error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/login - Authenticate user & load role, permissions, property, workspaces
authRouter.post('/login', async (req, res) => {
  try {
    const { username } = req.body;
    const loginIdentifier = (username || 'reception').trim().toLowerCase();

    // 1. Find User
    const userRes = await query(`
      SELECT 
        u.id, 
        u.username, 
        u.email, 
        u.full_name, 
        u.role_id, 
        u.avatar_initials, 
        r.name as role_name, 
        r.description as role_description
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE (LOWER(u.username) = $1 OR LOWER(u.email) = $1) AND u.is_active = true
      LIMIT 1
    `, [loginIdentifier]);

    if (userRes.rows.length === 0) {
      return res.status(401).json({ success: false, error: `Invalid user '${loginIdentifier}'.` });
    }

    const user = userRes.rows[0];

    // 2. Load Workspaces for User's Role
    const workspacesRes = await query(`
      SELECT 
        w.id,
        w.category,
        w.name,
        w.description,
        w.icon,
        w.functions,
        w.badge_metric,
        w.is_implemented,
        w.display_order
      FROM workspaces w
      JOIN role_workspaces rw ON w.id = rw.workspace_id
      WHERE rw.role_id = $1 AND w.is_active = true
      ORDER BY w.display_order ASC
    `, [user.role_id]);

    // 3. Load User's Authorized Properties
    const propertiesRes = await query(`
      SELECT 
        p.id,
        p.code,
        p.name,
        p.location,
        p.currency,
        p.currency_symbol,
        p.stars,
        p.rooms_count,
        up.is_default
      FROM properties p
      JOIN user_properties up ON p.id = up.property_id
      WHERE up.user_id = $1 AND p.is_active = true
      ORDER BY up.is_default DESC, p.name ASC
    `, [user.id]);

    // Attach dynamic telemetry badges
    const indicators = await getWorkspaceLiveIndicators();
    const enrichedWorkspaces = workspacesRes.rows.map((ws: any) => {
      let liveBadge = null;
      if (ws.id === 'FRONT_DESK') liveBadge = indicators.arrivalsAttention;
      if (ws.id === 'HOUSEKEEPING') liveBadge = indicators.pendingRooms;
      if (ws.id === 'MAINTENANCE') liveBadge = indicators.openOrders;
      if (ws.id === 'FB') liveBadge = indicators.activeOrders;
      if (ws.id === 'INVENTORY') liveBadge = indicators.lowStock;
      if (ws.id === 'PROCUREMENT') liveBadge = indicators.pendingPOs;

      return {
        ...ws,
        liveBadge,
      };
    });

    const defaultProperty = propertiesRes.rows.find((p: any) => p.is_default) || propertiesRes.rows[0];

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.full_name,
          roleId: user.role_id,
          roleName: user.role_name,
          roleDescription: user.role_description,
          avatarInitials: user.avatar_initials,
        },
        currentProperty: defaultProperty,
        availableProperties: propertiesRes.rows,
        authorizedWorkspaces: enrichedWorkspaces,
        token: `session-jwt-${user.id}-${Date.now()}`,
      },
    });
  } catch (err: any) {
    console.error('[Auth.login error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/auth/workspaces - Fetch workspaces for current user/role with live indicators
authRouter.get('/workspaces', async (req, res) => {
  try {
    const roleId = (req.query.role as string) || 'GENERAL_MANAGER';
    const workspacesRes = await query(`
      SELECT 
        w.id,
        w.category,
        w.name,
        w.description,
        w.icon,
        w.functions,
        w.badge_metric,
        w.is_implemented,
        w.display_order
      FROM workspaces w
      JOIN role_workspaces rw ON w.id = rw.workspace_id
      WHERE rw.role_id = $1 AND w.is_active = true
      ORDER BY w.display_order ASC
    `, [roleId]);

    const indicators = await getWorkspaceLiveIndicators();
    const enrichedWorkspaces = workspacesRes.rows.map((ws: any) => {
      let liveBadge = null;
      if (ws.id === 'FRONT_DESK') liveBadge = indicators.arrivalsAttention;
      if (ws.id === 'HOUSEKEEPING') liveBadge = indicators.pendingRooms;
      if (ws.id === 'MAINTENANCE') liveBadge = indicators.openOrders;
      if (ws.id === 'FB') liveBadge = indicators.activeOrders;
      if (ws.id === 'INVENTORY') liveBadge = indicators.lowStock;
      if (ws.id === 'PROCUREMENT') liveBadge = indicators.pendingPOs;

      return {
        ...ws,
        liveBadge,
      };
    });

    res.json({ success: true, data: enrichedWorkspaces });
  } catch (err: any) {
    console.error('[Auth.getWorkspaces error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});
