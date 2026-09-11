// ==========================================================================
// VOLVITECH HOSPITALITY OS — AUTH & WORKSPACES API CLIENT
// ==========================================================================

const API_BASE = '/api/auth';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  const json = await response.json();
  if (!response.ok || json.success === false) {
    throw new Error(json.error || `HTTP error ${response.status}`);
  }
  return json;
}

export const authClient = {
  // Get pre-configured demo personas
  getDemoUsers: () => request('/demo-users'),

  // Authenticate user & load roles, properties, workspaces
  login: (username, password = 'password123') =>
    request('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  // Get workspaces with dynamic telemetry indicators
  getWorkspaces: (roleId) => request(`/workspaces${roleId ? `?role=${encodeURIComponent(roleId)}` : ''}`),
};
