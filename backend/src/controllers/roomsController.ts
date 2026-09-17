// ==========================================================================
// VOLVITECH HOSPITALITY OS — ROOM & ROOM TYPES CONTROLLER (TIER 2: API)
// Master Hotel Room Configuration & Floor Operations
// ==========================================================================
import { Router } from 'express';
import { RoomRepository } from '../repositories/roomRepository.js';

export const roomsRouter = Router();
export const roomTypesRouter = Router();

// ── PHYSICAL ROOMS API ────────────────────────────────────────────────────────

// GET /api/rooms - List all rooms with room type details & allocation status
roomsRouter.get('/', async (_req, res) => {
  try {
    const rooms = await RoomRepository.findAllRoomsWithDetails();
    res.json({ success: true, data: rooms });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/rooms - Create a single physical room
roomsRouter.post('/', async (req, res) => {
  try {
    const { room_number, floor, room_type_id, bed_count, operational_status } = req.body;
    if (!room_number || !floor || !room_type_id) {
      return res.status(400).json({
        success: false,
        error: 'room_number, floor, and room_type_id are required fields',
      });
    }

    const newRoom = await RoomRepository.createRoom({
      room_number,
      floor,
      room_type_id,
      bed_count: bed_count ? Number(bed_count) : 1,
      operational_status,
    });

    res.status(201).json({ success: true, data: newRoom });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/rooms/batch - Batch generate rooms for a floor
roomsRouter.post('/batch', async (req, res) => {
  try {
    const { floor, room_type_id, room_numbers, start_number, end_number, operational_status } = req.body;
    if (!floor || !room_type_id) {
      return res.status(400).json({
        success: false,
        error: 'floor and room_type_id are required fields',
      });
    }

    let numbersToCreate: string[] = [];
    if (Array.isArray(room_numbers) && room_numbers.length > 0) {
      numbersToCreate = room_numbers.map((n: any) => String(n).trim()).filter(Boolean);
    } else if (start_number !== undefined && end_number !== undefined) {
      const start = parseInt(start_number, 10);
      const end = parseInt(end_number, 10);
      if (isNaN(start) || isNaN(end) || start > end) {
        return res.status(400).json({
          success: false,
          error: 'start_number must be a number less than or equal to end_number',
        });
      }
      if (end - start > 100) {
        return res.status(400).json({
          success: false,
          error: 'Cannot batch create more than 100 rooms in a single request',
        });
      }
      for (let i = start; i <= end; i++) {
        numbersToCreate.push(String(i));
      }
    } else {
      return res.status(400).json({
        success: false,
        error: 'Provide either room_numbers array or start_number and end_number range',
      });
    }

    const result = await RoomRepository.batchCreateRooms({
      floor,
      room_type_id,
      room_numbers: numbersToCreate,
      bed_count: req.body.bed_count ? Number(req.body.bed_count) : 1,
      operational_status,
    });

    res.status(201).json({ success: true, data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT /api/rooms/:id - Update an existing room
roomsRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { room_number, floor, room_type_id, bed_count, operational_status, is_active } = req.body;

    const updated = await RoomRepository.updateRoom(id, {
      room_number,
      floor,
      room_type_id,
      bed_count: bed_count !== undefined ? Number(bed_count) : undefined,
      operational_status,
      is_active,
    });

    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE /api/rooms/:id - Remove a room
roomsRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await RoomRepository.deleteRoom(id);
    res.json({ success: true, message: 'Room deleted successfully' });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ── ROOM TYPES API ────────────────────────────────────────────────────────────

// GET /api/room-types - List all room types with room count metrics
roomTypesRouter.get('/', async (_req, res) => {
  try {
    const types = await RoomRepository.findAllRoomTypesWithCounts();
    res.json({ success: true, data: types });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/room-types - Create new room type
roomTypesRouter.post('/', async (req, res) => {
  try {
    const { code, name, description, base_occupancy, max_occupancy, base_price, color_code } = req.body;
    if (!code || !name || base_price === undefined) {
      return res.status(400).json({
        success: false,
        error: 'code, name, and base_price are required fields',
      });
    }

    const newType = await RoomRepository.createRoomType({
      code,
      name,
      description,
      base_occupancy: Number(base_occupancy) || 2,
      max_occupancy: Number(max_occupancy) || 3,
      base_price: Number(base_price),
      color_code,
    });

    res.status(201).json({ success: true, data: newType });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT /api/room-types/:id - Update room type
roomTypesRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, description, base_occupancy, max_occupancy, base_price, color_code, is_active } = req.body;

    const updated = await RoomRepository.updateRoomType(id, {
      code,
      name,
      description,
      base_occupancy: base_occupancy !== undefined ? Number(base_occupancy) : undefined,
      max_occupancy: max_occupancy !== undefined ? Number(max_occupancy) : undefined,
      base_price: base_price !== undefined ? Number(base_price) : undefined,
      color_code,
      is_active,
    });

    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE /api/room-types/:id - Delete room type
roomTypesRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await RoomRepository.deleteRoomType(id);
    res.json({ success: true, message: 'Room type deleted successfully' });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});
