// ==========================================================================
// VOLVITECH HOSPITALITY OS — DOMAIN ENTITIES & INTERFACES (DATA TIER MODELS)
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

export interface GuestEntity {
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
  preferences?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface RoomTypeEntity {
  id: string;
  property_id?: string;
  code: string;
  name: string;
  description?: string;
  base_occupancy: number;
  max_occupancy: number;
  base_price_cents: number;
  total_inventory: number;
  is_active: boolean;
}

export interface RoomEntity {
  id: string;
  property_id?: string;
  room_type_id: string;
  room_number: string;
  floor: string;
  operational_status: RoomOperationalStatus;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BookingSourceEntity {
  id: string;
  code: string;
  name: string;
  channel_type: string;
  commission_rate_pct: number;
  is_active: boolean;
}

export interface RatePlanEntity {
  id: string;
  code: string;
  name: string;
  description?: string;
  cancellation_policy?: string;
  deposit_required: boolean;
  is_active: boolean;
}

export interface ReservationEntity {
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
  estimated_arrival_time?: string | null;
  special_requests?: string | null;
  currency: string;
  nightly_rate: string | number;
  total_amount: string | number;
  cancelled_at?: string | null;
  cancellation_reason?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface RoomAllocationEntity {
  id: string;
  reservation_id: string;
  room_id: string;
  assigned_at: string;
  released_at?: string | null;
  status: 'ACTIVE' | 'RELEASED' | 'TRANSFERRED';
}

export interface FolioChargeEntity {
  id: string;
  folio_id: string;
  category: 'ROOM' | 'FB_DINING' | 'SPA' | 'MINIBAR' | 'LAUNDRY' | 'TAX' | 'INCIDENTAL';
  description: string;
  amount: string | number;
  tax_amount: string | number;
  created_at?: string;
}

export interface FolioEntity {
  id: string;
  reservation_id: string;
  guest_id: string;
  folio_number: string;
  status: 'OPEN' | 'CLOSED' | 'SETTLED' | 'DISPUTED';
  balance: string | number;
  currency: string;
  created_at?: string;
  updated_at?: string;
  charges?: FolioChargeEntity[];
}

export interface ReservationDetailDTO extends ReservationEntity {
  first_name: string;
  last_name: string;
  guest_email: string | null;
  guest_phone: string | null;
  dial_code: string | null;
  nationality: string | null;
  id_document_type: string | null;
  id_document_number: string | null;
  vip_status: VipStatus;
  room_type_name: string;
  room_type_code: string;
  booking_source_name: string;
  rate_plan_name: string;
  cancellation_policy?: string;
  allocated_room_id?: string | null;
  allocated_room_number?: string | null;
  allocated_room_floor?: string | null;
  folio_id?: string | null;
  folio_number?: string | null;
  folio_balance?: string | number | null;
  charges?: FolioChargeEntity[];
}

export interface DashboardMetricsDTO {
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
  metrics?: {
    arrivals: { actual: number; expected: number };
    departures: { cleared: number; expected: number };
    occupancy: { percentage: number; occupied: number; total: number };
    inHouse: { guests: number; rooms: number };
  };
  days?: string[];
  availabilityGrid?: Array<{
    roomTypeId: string;
    categoryName: string;
    code: string;
    colorCode: string;
    days: Array<{
      date: string;
      dayLabel: string;
      available: number;
      total: number;
      isLow: boolean;
      isSoldOut: boolean;
    }>;
  }>;
}

