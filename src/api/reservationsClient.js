// ==========================================================================
// VOLVITECH HOSPITALITY OS — API CLIENT
// ==========================================================================

const API_BASE = '/api';

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

export const reservationsClient = {
  // Dashboard Metrics & 7-day availability
  getDashboardMetrics: (startDate) => request(`/dashboard/metrics${startDate ? `?startDate=${encodeURIComponent(startDate)}` : ''}`),

  // Metadata (Room Types, Rate Plans, Booking Sources, Physical Rooms)
  getMeta: () => request('/meta'),

  // Get physical rooms
  getRooms: async () => {
    const res = await request('/meta');
    return { success: true, data: res.data?.rooms || [] };
  },

  // Guest Autocomplete
  searchGuests: (q) => request(`/meta/guests/search?q=${encodeURIComponent(q)}`),

  // Reservations List / Search
  getReservations: (params = {}) => {
    const query = new URLSearchParams();
    if (params.q) query.append('q', params.q);
    if (params.status && params.status !== 'ALL') query.append('status', params.status);
    if (params.source && params.source !== 'ALL') query.append('source', params.source);
    if (params.fromDate) query.append('fromDate', params.fromDate);
    if (params.toDate) query.append('toDate', params.toDate);
    const qs = query.toString();
    return request(`/reservations${qs ? `?${qs}` : ''}`);
  },

  // Reservation Details
  getReservationDetail: (id) => request(`/reservations/${id}`),

  // Create New Booking
  createReservation: (bookingData) =>
    request('/reservations', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    }),

  // Cancel Reservation
  cancelReservation: (id, reason) =>
    request(`/reservations/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  // Allocate Physical Room
  allocateRoom: (id, roomId) =>
    request(`/reservations/${id}/allocate-room`, {
      method: 'POST',
      body: JSON.stringify({ roomId }),
    }),

  // Complete Check-In
  checkIn: (id, roomId = null) =>
    request(`/reservations/${id}/check-in`, {
      method: 'POST',
      body: JSON.stringify({ roomId }),
    }),

  // Complete Check-Out & Settle
  checkOut: (id) =>
    request(`/reservations/${id}/check-out`, {
      method: 'POST',
    }),

  // Post Incidental / Service Charge to Folio
  postFolioCharge: (id, chargeData) =>
    request(`/reservations/${id}/folio-charge`, {
      method: 'POST',
      body: JSON.stringify(chargeData),
    }),
};
