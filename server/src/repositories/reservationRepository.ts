// ==========================================================================
// VOLVITECH HOSPITALITY OS — RESERVATION REPOSITORY (TIER 3: DATA ACCESS)
// ==========================================================================
import { query, pool } from '../db/pool.js';
import type { ReservationEntity, ReservationDetailDTO } from '../types/entities.js';
import type { PoolClient } from 'pg';

export interface ReservationFilterOptions {
  q?: string;
  status?: string;
  source?: string;
  fromDate?: string;
  toDate?: string;
}

export class ReservationRepository {
  static async findReservations(filters: ReservationFilterOptions = {}): Promise<ReservationDetailDTO[]> {
    let sql = `
      SELECT 
        r.id,
        r.reservation_number,
        r.guest_id,
        r.booking_source_id,
        r.room_type_id,
        r.rate_plan_id,
        TO_CHAR(r.check_in_date, 'YYYY-MM-DD') AS check_in_date,
        TO_CHAR(r.check_out_date, 'YYYY-MM-DD') AS check_out_date,
        r.adults,
        r.children,
        r.status,
        r.special_requests,
        r.currency,
        r.nightly_rate,
        r.total_amount,
        r.created_at,
        r.updated_at,
        g.first_name,
        g.last_name,
        g.email AS guest_email,
        g.phone AS guest_phone,
        g.dial_code,
        g.nationality,
        g.id_document_type,
        g.id_document_number,
        g.vip_status,
        rt.name AS room_type_name,
        rt.code AS room_type_code,
        bs.name AS booking_source_name,
        rp.name AS rate_plan_name,
        rp.cancellation_policy,
        rm.id AS allocated_room_id,
        rm.room_number AS allocated_room_number,
        rm.floor AS allocated_room_floor,
        rm.operational_status AS room_operational_status,
        f.id AS folio_id,
        f.folio_number,
        f.balance AS folio_balance
      FROM reservations r
      JOIN guests g ON r.guest_id = g.id
      JOIN room_types rt ON r.room_type_id = rt.id
      JOIN booking_sources bs ON r.booking_source_id = bs.id
      JOIN rate_plans rp ON r.rate_plan_id = rp.id
      LEFT JOIN room_allocations ra ON r.id = ra.reservation_id AND ra.status = 'ACTIVE'
      LEFT JOIN rooms rm ON ra.room_id = rm.id
      LEFT JOIN folios f ON r.id = f.reservation_id
      WHERE 1=1
    `;

    const params: any[] = [];
    let pIndex = 1;

    if (filters.q && filters.q.trim()) {
      const term = `%${filters.q.trim()}%`;
      sql += ` AND (
        r.reservation_number ILIKE $${pIndex} OR 
        g.first_name ILIKE $${pIndex} OR 
        g.last_name ILIKE $${pIndex} OR 
        g.email ILIKE $${pIndex} OR 
        g.phone ILIKE $${pIndex}
      )`;
      params.push(term);
      pIndex++;
    }

    if (filters.status && filters.status !== 'ALL') {
      sql += ` AND r.status = $${pIndex}`;
      params.push(filters.status);
      pIndex++;
    }

    if (filters.source && filters.source !== 'ALL') {
      sql += ` AND r.booking_source_id = $${pIndex}`;
      params.push(filters.source);
      pIndex++;
    }

    if (filters.fromDate) {
      sql += ` AND r.check_in_date >= $${pIndex}`;
      params.push(filters.fromDate);
      pIndex++;
    }

    if (filters.toDate) {
      sql += ` AND r.check_out_date <= $${pIndex}`;
      params.push(filters.toDate);
      pIndex++;
    }

    sql += ` ORDER BY r.created_at DESC`;

    const res = await query<ReservationDetailDTO>(sql, params);
    return res.rows;
  }

  static async findByIdOrNumber(idOrNumber: string): Promise<ReservationDetailDTO | null> {
    const sql = `
      SELECT 
        r.id,
        r.reservation_number,
        r.guest_id,
        r.booking_source_id,
        r.room_type_id,
        r.rate_plan_id,
        TO_CHAR(r.check_in_date, 'YYYY-MM-DD') AS check_in_date,
        TO_CHAR(r.check_out_date, 'YYYY-MM-DD') AS check_out_date,
        r.adults,
        r.children,
        r.status,
        r.special_requests,
        r.currency,
        r.nightly_rate,
        r.total_amount,
        r.created_at,
        r.updated_at,
        g.first_name,
        g.last_name,
        g.email AS guest_email,
        g.phone AS guest_phone,
        g.dial_code,
        g.nationality,
        g.id_document_type,
        g.id_document_number,
        g.vip_status,
        rt.name AS room_type_name,
        rt.code AS room_type_code,
        bs.name AS booking_source_name,
        rp.name AS rate_plan_name,
        rp.cancellation_policy,
        rm.id AS allocated_room_id,
        rm.room_number AS allocated_room_number,
        rm.floor AS allocated_room_floor,
        rm.operational_status AS room_operational_status,
        f.id AS folio_id,
        f.folio_number,
        f.balance AS folio_balance
      FROM reservations r
      JOIN guests g ON r.guest_id = g.id
      JOIN room_types rt ON r.room_type_id = rt.id
      JOIN booking_sources bs ON r.booking_source_id = bs.id
      JOIN rate_plans rp ON r.rate_plan_id = rp.id
      LEFT JOIN room_allocations ra ON r.id = ra.reservation_id AND ra.status = 'ACTIVE'
      LEFT JOIN rooms rm ON ra.room_id = rm.id
      LEFT JOIN folios f ON r.id = f.reservation_id
      WHERE r.id::text = $1 OR r.reservation_number = $1
    `;
    const res = await query<ReservationDetailDTO>(sql, [idOrNumber]);
    return res.rows[0] || null;
  }

  static async getNextReservationNumber(client: PoolClient): Promise<string> {
    const res = await client.query(`SELECT nextval('reservation_number_seq') AS seq`);
    const seq = res.rows[0].seq;
    return `HX-${8920 + parseInt(seq, 10)}`;
  }

  static async insertReservation(data: {
    reservationNumber: string;
    guestId: string;
    bookingSourceId: string;
    roomTypeId: string;
    ratePlanId: string;
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    children: number;
    specialRequests?: string | null;
    nightlyRate: number;
    totalAmount: number;
  }, client: PoolClient): Promise<ReservationEntity> {
    const res = await client.query<ReservationEntity>(
      `INSERT INTO reservations (
        reservation_number, guest_id, booking_source_id, room_type_id, rate_plan_id,
        check_in_date, check_out_date, adults, children, status, special_requests,
        currency, nightly_rate, total_amount
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'CONFIRMED', $10, 'USD', $11, $12)
      RETURNING *`,
      [
        data.reservationNumber,
        data.guestId,
        data.bookingSourceId,
        data.roomTypeId,
        data.ratePlanId,
        data.checkInDate,
        data.checkOutDate,
        data.adults,
        data.children,
        data.specialRequests || null,
        data.nightlyRate,
        data.totalAmount,
      ]
    );
    return res.rows[0];
  }

  static async updateStatus(id: string, status: string, client?: PoolClient): Promise<void> {
    const executor = client || pool;
    await executor.query(
      `UPDATE reservations SET status = $1, updated_at = NOW() WHERE id::text = $2 OR reservation_number = $2`,
      [status, id]
    );
  }

  static async cancelReservation(id: string, reason: string, client: PoolClient): Promise<ReservationEntity> {
    const res = await client.query<ReservationEntity>(
      `UPDATE reservations 
       SET status = 'CANCELLED', cancelled_at = NOW(), cancellation_reason = $2, updated_at = NOW() 
       WHERE (id::text = $1 OR reservation_number = $1) AND status != 'CANCELLED'
       RETURNING *`,
      [id, reason]
    );
    return res.rows[0];
  }
}
