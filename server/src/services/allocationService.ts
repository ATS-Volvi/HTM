// ==========================================================================
// VOLVITECH HOSPITALITY OS — ALLOCATION SERVICE (TIER 2: BUSINESS LOGIC)
// ==========================================================================
import { getClient } from '../db/pool.js';
import { ReservationRepository } from '../repositories/reservationRepository.js';
import { RoomRepository } from '../repositories/roomRepository.js';

export class AllocationService {
  static async allocatePhysicalRoom(reservationIdOrNumber: string, roomId: string) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      const resv = await ReservationRepository.findByIdOrNumber(reservationIdOrNumber);
      if (!resv) {
        throw new Error('Reservation not found');
      }

      // Check date conflict
      const conflict = await RoomRepository.checkRoomConflict(
        roomId,
        resv.check_in_date,
        resv.check_out_date,
        resv.id,
        client
      );

      if (conflict) {
        throw new Error(`Room is already allocated to reservation ${conflict}`);
      }

      await RoomRepository.allocateRoom(resv.id, roomId, client);
      const room = await RoomRepository.findById(roomId);

      await client.query('COMMIT');
      return room;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}
