// ==========================================================================
// VOLVITECH HOSPITALITY OS — BILLING SERVICE (TIER 2: BUSINESS LOGIC)
// ==========================================================================
import { getClient } from '../db/pool.js';
import { ReservationRepository } from '../repositories/reservationRepository.js';
import { RoomRepository } from '../repositories/roomRepository.js';
import { FolioRepository } from '../repositories/folioRepository.js';

export class BillingService {
  static async postCharge(reservationIdOrNumber: string, category: string, description: string, amount: number) {
    const resv = await ReservationRepository.findByIdOrNumber(reservationIdOrNumber);
    if (!resv) {
      throw new Error('Reservation not found');
    }

    const folio = await FolioRepository.findByReservationId(resv.id);
    if (!folio) {
      throw new Error('Folio not found for this reservation');
    }

    const tax = amount * 0.10; // 10% standard hospitality duty
    return await FolioRepository.addCharge(folio.id, category, description, amount, tax);
  }

  static async checkOutGuest(reservationIdOrNumber: string) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      const resv = await ReservationRepository.findByIdOrNumber(reservationIdOrNumber);
      if (!resv) {
        throw new Error('Reservation not found');
      }

      if (resv.status !== 'CHECKED_IN') {
        throw new Error(`Cannot check out reservation with status '${resv.status}' (must be CHECKED_IN)`);
      }

      // 1. Release active room allocation & mark physical room VACANT_DIRTY for housekeeping
      const allocatedRoomId = await RoomRepository.releaseAllocation(resv.id, client);
      if (allocatedRoomId) {
        await RoomRepository.updateOperationalStatus(allocatedRoomId, 'VACANT_DIRTY', client);
      }

      // 2. Transition reservation status to CHECKED_OUT
      await ReservationRepository.updateStatus(resv.id, 'CHECKED_OUT', client);

      // 3. Settle folio
      await FolioRepository.closeFolio(resv.id, client);

      await client.query('COMMIT');
      return {
        success: true,
        message: `Reservation ${resv.reservation_number} checked out successfully. Room dispatched to Housekeeping turnover.`,
      };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}
