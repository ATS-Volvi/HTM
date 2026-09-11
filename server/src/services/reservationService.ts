// ==========================================================================
// VOLVITECH HOSPITALITY OS — RESERVATION SERVICE (TIER 2: BUSINESS LOGIC)
// ==========================================================================
import { getClient } from '../db/pool.js';
import { ReservationRepository } from '../repositories/reservationRepository.js';
import { GuestRepository } from '../repositories/guestRepository.js';
import { RoomRepository } from '../repositories/roomRepository.js';
import { FolioRepository } from '../repositories/folioRepository.js';
import type { ReservationDetailDTO, VipStatus } from '../types/entities.js';

export interface CreateBookingDTO {
  checkInDate: string;
  checkOutDate: string;
  adults?: number;
  children?: number;
  roomTypeId: string;
  ratePlanId: string;
  bookingSourceId: string;
  roomId?: string | null;
  specialRequests?: string | null;
  guestId?: string | null;
  guest?: {
    firstName: string;
    lastName: string;
    email?: string | null;
    phone?: string | null;
    dialCode?: string | null;
    nationality?: string | null;
    idDocType?: string | null;
    idDocNumber?: string | null;
    vipStatus?: VipStatus;
  };
}

export class ReservationService {
  static async searchReservations(filters: any) {
    return await ReservationRepository.findReservations(filters);
  }

  static async getReservationById(idOrNumber: string): Promise<ReservationDetailDTO> {
    const reservation = await ReservationRepository.findByIdOrNumber(idOrNumber);
    if (!reservation) {
      throw new Error(`Reservation '${idOrNumber}' not found`);
    }

    if (reservation.folio_id) {
      const folio = await FolioRepository.findByReservationId(reservation.id);
      if (folio && folio.charges) {
        reservation.charges = folio.charges;
      }
    }

    return reservation;
  }

  static async createReservation(dto: CreateBookingDTO) {
    // 1. Business Validation: Date Rules
    const start = new Date(dto.checkInDate);
    const end = new Date(dto.checkOutDate);
    const diffTime = end.getTime() - start.getTime();
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (nights <= 0 || isNaN(nights)) {
      throw new Error('Check-out date must be strictly after check-in date');
    }

    const client = await getClient();
    try {
      await client.query('BEGIN');

      // 2. Resolve Guest CRM Profile
      let guestId = dto.guestId;
      if (!guestId) {
        if (!dto.guest || !dto.guest.firstName || !dto.guest.lastName) {
          throw new Error('Guest first name and last name are required for new guest');
        }

        const existing = await GuestRepository.findByEmailOrPhone(dto.guest.email, dto.guest.phone, client);
        if (existing) {
          guestId = existing.id;
        } else {
          const newGuest = await GuestRepository.createGuest(dto.guest, client);
          guestId = newGuest.id;
        }
      }

      // 3. Category Inventory Availability Check
      const totalInvRes = await client.query(
        `SELECT total_inventory FROM room_types WHERE id = $1`,
        [dto.roomTypeId]
      );
      if (totalInvRes.rows.length === 0) {
        throw new Error('Selected room type does not exist');
      }
      const totalCapacity = totalInvRes.rows[0].total_inventory;

      const activeBookingsRes = await client.query(
        `SELECT COUNT(*) AS booked 
         FROM reservations 
         WHERE room_type_id = $1 
           AND status IN ('CONFIRMED', 'CHECKED_IN')
           AND check_in_date < $3 
           AND check_out_date > $2`,
        [dto.roomTypeId, dto.checkInDate, dto.checkOutDate]
      );
      const bookedCount = parseInt(activeBookingsRes.rows[0].booked, 10);
      if (bookedCount >= totalCapacity) {
        throw new Error('Selected room type is completely sold out for the requested stay dates');
      }

      // 4. Matrix Rate Pricing Calculation
      const ratePlanRes = await client.query(
        `SELECT rprt.nightly_rate, rt.base_price
         FROM rate_plans rp
         JOIN rate_plan_room_types rprt ON rp.id = rprt.rate_plan_id
         JOIN room_types rt ON rprt.room_type_id = rt.id
         WHERE rp.id = $1 AND rt.id = $2`,
        [dto.ratePlanId, dto.roomTypeId]
      );

      let nightlyRate = 280.00;
      if (ratePlanRes.rows.length > 0) {
        nightlyRate = parseFloat(ratePlanRes.rows[0].nightly_rate) || 280.00;
      }
      const totalAmount = nightlyRate * nights;

      // 5. Sequential Confirmation Number
      const resNumber = await ReservationRepository.getNextReservationNumber(client);

      // 6. Insert Reservation
      const newRes = await ReservationRepository.insertReservation({
        reservationNumber: resNumber,
        guestId,
        bookingSourceId: dto.bookingSourceId,
        roomTypeId: dto.roomTypeId,
        ratePlanId: dto.ratePlanId,
        checkInDate: dto.checkInDate,
        checkOutDate: dto.checkOutDate,
        adults: dto.adults || 1,
        children: dto.children || 0,
        specialRequests: dto.specialRequests,
        nightlyRate,
        totalAmount,
      }, client);

      // 7. Optional Physical Room Allocation
      let allocatedRoomNumber: string | null = null;
      if (dto.roomId) {
        const conflict = await RoomRepository.checkRoomConflict(dto.roomId, dto.checkInDate, dto.checkOutDate, undefined, client);
        if (conflict) {
          throw new Error(`Room is already allocated to reservation ${conflict} for overlapping dates`);
        }
        await RoomRepository.allocateRoom(newRes.id, dto.roomId, client);
        const rm = await RoomRepository.findById(dto.roomId);
        allocatedRoomNumber = rm?.room_number || null;
      }

      // 8. Open Folio Foundation
      const folioNumber = `FOL-${resNumber.replace('HX-', '')}`;
      const folio = await FolioRepository.createFolio(newRes.id, guestId, folioNumber, client);
      await FolioRepository.addCharge(
        folio.id,
        'ROOM',
        `Room Tariff Estimation (${nights} nights)`,
        totalAmount,
        totalAmount * 0.10,
        client
      );

      await client.query('COMMIT');

      return {
        ...newRes,
        allocatedRoomNumber,
        folioNumber,
      };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  static async cancelReservation(id: string, reason: string) {
    const client = await getClient();
    try {
      await client.query('BEGIN');
      const updated = await ReservationRepository.cancelReservation(id, reason, client);
      if (!updated) {
        throw new Error('Reservation not found or already cancelled');
      }
      await RoomRepository.releaseAllocation(updated.id, client);
      await client.query('COMMIT');
      return updated;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}
