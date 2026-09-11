// ==========================================================================
// VOLVITECH HOSPITALITY OS — GUEST REPOSITORY (TIER 3: DATA ACCESS)
// ==========================================================================
import { query, pool } from '../db/pool.js';
import type { GuestEntity, VipStatus } from '../types/entities.js';
import type { PoolClient } from 'pg';

export class GuestRepository {
  static async searchGuests(term: string): Promise<GuestEntity[]> {
    const q = `%${term.trim()}%`;
    const res = await query<GuestEntity>(
      `SELECT * FROM guests 
       WHERE first_name ILIKE $1 
          OR last_name ILIKE $1 
          OR email ILIKE $1 
          OR phone ILIKE $1
       ORDER BY last_name ASC 
       LIMIT 25`,
      [q]
    );
    return res.rows;
  }

  static async findById(id: string): Promise<GuestEntity | null> {
    const res = await query<GuestEntity>(`SELECT * FROM guests WHERE id = $1`, [id]);
    return res.rows[0] || null;
  }

  static async findByEmailOrPhone(email?: string | null, phone?: string | null, client?: PoolClient): Promise<GuestEntity | null> {
    const executor = client || pool;
    if (email && email.trim()) {
      const res = await executor.query<GuestEntity>(`SELECT * FROM guests WHERE email = $1`, [email.trim().toLowerCase()]);
      if (res.rows.length > 0) return res.rows[0];
    }
    if (phone && phone.trim()) {
      const res = await executor.query<GuestEntity>(`SELECT * FROM guests WHERE phone = $1`, [phone.trim()]);
      if (res.rows.length > 0) return res.rows[0];
    }
    return null;
  }

  static async createGuest(data: {
    firstName: string;
    lastName: string;
    email?: string | null;
    phone?: string | null;
    dialCode?: string | null;
    nationality?: string | null;
    idDocType?: string | null;
    idDocNumber?: string | null;
    vipStatus?: VipStatus;
  }, client: PoolClient): Promise<GuestEntity> {
    const res = await client.query<GuestEntity>(
      `INSERT INTO guests (
        first_name, last_name, email, phone, dial_code, nationality,
        id_document_type, id_document_number, vip_status, total_stays, lifetime_spend
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 0, 0.00)
      RETURNING *`,
      [
        data.firstName,
        data.lastName,
        data.email?.trim().toLowerCase() || null,
        data.phone?.trim() || null,
        data.dialCode || '+1',
        data.nationality || 'United States',
        data.idDocType || 'PASSPORT',
        data.idDocNumber || null,
        data.vipStatus || 'STANDARD',
      ]
    );
    return res.rows[0];
  }

  static async incrementStays(guestId: string, client?: PoolClient): Promise<void> {
    const executor = client || pool;
    await executor.query(
      `UPDATE guests SET total_stays = total_stays + 1, updated_at = NOW() WHERE id = $1`,
      [guestId]
    );
  }
}
