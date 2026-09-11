// ==========================================================================
// VOLVITECH HOSPITALITY OS — PRESENTATION TIER TYPE DEFINITIONS
// ==========================================================================

export type ReservationStatus = 
  | 'DRAFT' 
  | 'CONFIRMED' 
  | 'CHECKED_IN' 
  | 'CHECKED_OUT' 
  | 'CANCELLED' 
  | 'NO_SHOW';

export type RoomOperationalStatus = 
  | 'VACANT_CLEAN' 
  | 'VACANT_DIRTY' 
  | 'OCCUPIED' 
  | 'OUT_OF_ORDER' 
  | 'INSPECTION_REQUIRED';

export type VipStatus = 'STANDARD' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'VIP';

export interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  dial_code: string | null;
  nationality: string | null;
  id_document_type: string | null;
  id_document_number: string | null;
  vip_status: VipStatus;
  total_stays: number;
  lifetime_spend: string | number;
}

export interface RoomType {
  id: string;
  code: string;
  name: string;
  base_occupancy: number;
  max_occupancy: number;
  base_price_cents: number;
  total_inventory: number;
  is_active: boolean;
}

export interface Room {
  id: string;
  room_type_id: string;
  room_number: string;
  floor: string;
  operational_status: RoomOperationalStatus;
  is_active: boolean;
}

export interface RatePlan {
  id: string;
  code: string;
  name: string;
  cancellation_policy?: string;
  deposit_required: boolean;
  is_active: boolean;
}

export interface BookingSource {
  id: string;
  code: string;
  name: string;
  channel_type: string;
  commission_rate_pct: number;
  is_active: boolean;
}

export interface FolioCharge {
  id: string;
  folio_id: string;
  category: string;
  description: string;
  amount: string | number;
  tax_amount: string | number;
  created_at?: string;
}

export interface Reservation {
  id: string;
  reservation_number: string;
  guest_id: string;
  booking_source_id: string;
  room_type_id: string;
  rate_plan_id: string;
  check_in_date: string;
  check_out_date: string;
  adults: number;
  children: number;
  status: ReservationStatus;
  special_requests?: string | null;
  currency: string;
  nightly_rate: string | number;
  total_amount: string | number;
  created_at?: string;
  first_name: string;
  last_name: string;
  guest_email: string | null;
  guest_phone: string | null;
  dial_code: string | null;
  nationality: string | null;
  vip_status: VipStatus;
  room_type_name: string;
  room_type_code: string;
  booking_source_name: string;
  rate_plan_name: string;
  cancellation_policy?: string;
  allocated_room_id?: string | null;
  allocated_room_number?: string | null;
  allocated_room_floor?: string | null;
  room_operational_status?: RoomOperationalStatus;
  folio_id?: string | null;
  folio_number?: string | null;
  folio_balance?: string | number | null;
  charges?: FolioCharge[];
}

export interface DashboardMetrics {
  arrivalsToday: number;
  departuresToday: number;
  currentOccupancyPct: number;
  inHouseGuests: number;
  totalRooms: number;
  occupiedRooms: number;
  availabilityMatrix: {
    dates: string[];
    categories: Array<{
      id: string;
      code: string;
      name: string;
      total: number;
      rates: number[];
      counts: number[];
    }>;
  };
}

export interface MetaLookupData {
  roomTypes: RoomType[];
  ratePlans: RatePlan[];
  bookingSources: BookingSource[];
  rooms: Room[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
  count?: number;
}
