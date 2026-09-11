// ==========================================================================
// VOLVITECH HOSPITALITY OS — CHECK-IN SERVICE (TIER 2: BUSINESS LOGIC)
// ==========================================================================
import { getClient } from '../db/pool.js';
import { ReservationRepository } from '../repositories/reservationRepository.js';
import { RoomRepository } from '../repositories/roomRepository.js';
import { GuestRepository } from '../repositories/guestRepository.js';

export class CheckInService {
  static async checkInGuest(reservationIdOrNumber: string, requestedRoomId?: string | null) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      const resv = await ReservationRepository.findByIdOrNumber(reservationIdOrNumber);
      if (!resv) {
        throw new Error('Reservation not found');
      }

      if (resv.status === 'CHECKED_IN') {
        throw new Error('Guest is already checked in');
      }

      if (resv.status === 'CANCELLED') {
        throw new Error('Cannot check in a cancelled reservation');
      }

      let targetRoomId = requestedRoomId;

      if (!targetRoomId) {
        // If room is already pre-allocated
        if (resv.allocated_room_id) {
          targetRoomId = resv.allocated_room_id;
        } else {
          // Auto-assign first vacant clean room of requested category
          const cleanRooms = await RoomRepository.findCleanVacantRooms(resv.room_type_id);
          if (cleanRooms.length === 0) {
            throw new Error('No Vacant Clean rooms available for auto-assignment. Please clean or assign a room manually.');
          }
          targetRoomId = cleanRooms[0].id;
          await RoomRepository.allocateRoom(resv.id, targetRoomId, client);
        }
      } else {
        // Verify room conflict if assigning a specific room
        const conflict = await RoomRepository.checkRoomConflict(
          targetRoomId,
          resv.check_in_date,
          resv.check_out_date,
          resv.id,
          client
        );
        if (conflict) {
          throw new Error(`Room is already allocated to reservation ${conflict}`);
        }
        await RoomRepository.allocateRoom(resv.id, targetRoomId, client);
      }

      // 1. Transition reservation status
      await ReservationRepository.updateStatus(resv.id, 'CHECKED_IN', client);

      // 2. Transition room operational status to OCCUPIED
      await RoomRepository.updateOperationalStatus(targetRoomId, 'OCCUPIED', client);

      // 3. Increment guest stay count
      await GuestRepository.incrementStays(resv.guest_id, client);

      await client.query('COMMIT');

      // Return updated reservation details
      return await ReservationRepository.findByIdOrNumber(resv.id);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}
