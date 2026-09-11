// ==========================================================================
// VOLVITECH HOSPITALITY OS — FOLIO REPOSITORY (TIER 3: DATA ACCESS)
// ==========================================================================
import { query, pool } from '../db/pool.js';
import type { FolioEntity, FolioChargeEntity } from '../types/entities.js';
import type { PoolClient } from 'pg';

export class FolioRepository {
  static async findByReservationId(reservationId: string): Promise<FolioEntity | null> {
    const res = await query<FolioEntity>(
      `SELECT * FROM folios WHERE reservation_id = $1`,
      [reservationId]
    );
    if (res.rows.length === 0) return null;

    const folio = res.rows[0];
    const charges = await query<FolioChargeEntity>(
      `SELECT * FROM folio_charges WHERE folio_id = $1 ORDER BY created_at ASC`,
      [folio.id]
    );
    folio.charges = charges.rows;
    return folio;
  }

  static async createFolio(reservationId: string, guestId: string, folioNumber: string, client: PoolClient): Promise<FolioEntity> {
    const res = await client.query<FolioEntity>(
      `INSERT INTO folios (reservation_id, guest_id, folio_number, status, balance, currency)
       VALUES ($1, $2, $3, 'OPEN', 0.00, 'USD') RETURNING *`,
      [reservationId, guestId, folioNumber]
    );
    return res.rows[0];
  }

  static async addCharge(
    folioId: string,
    category: string,
    description: string,
    amount: number,
    taxAmount: number,
    client?: PoolClient
  ): Promise<FolioChargeEntity> {
    const executor = client || pool;
    const res = await executor.query<FolioChargeEntity>(
      `INSERT INTO folio_charges (folio_id, category, description, amount, tax_amount)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [folioId, category, description, amount, taxAmount]
    );

    await executor.query(
      `UPDATE folios SET balance = balance + $1, updated_at = NOW() WHERE id = $2`,
      [amount + taxAmount, folioId]
    );

    return res.rows[0];
  }

  static async closeFolio(reservationId: string, client?: PoolClient): Promise<void> {
    const executor = client || pool;
    await executor.query(
      `UPDATE folios SET status = 'SETTLED', updated_at = NOW() WHERE reservation_id = $1`,
      [reservationId]
    );
  }
}
