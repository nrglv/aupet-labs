import { Pool } from 'pg';
import { Invoice } from './Invoice';

/** SRP: единственная ответственность - хранение счетов-фактур в PostgreSQL. */
export class InvoiceRepository {
  constructor(private readonly pool: Pool) {}

  /** Сохраняет счет и его позиции в одной транзакции. */
  async save(invoice: Invoice): Promise<Invoice> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const { rows } = await client.query<{ id: number }>(
        'INSERT INTO invoices (tax_rate) VALUES ($1) RETURNING id',
        [invoice.taxRate],
      );
      const id = rows[0].id;
      for (const item of invoice.items) {
        await client.query(
          'INSERT INTO invoice_items (invoice_id, name, price) VALUES ($1, $2, $3)',
          [id, item.name, item.price],
        );
      }
      await client.query('COMMIT');
      invoice.id = id;
      return invoice;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async findById(id: number): Promise<Invoice | null> {
    const invoice = await this.pool.query('SELECT tax_rate FROM invoices WHERE id = $1', [id]);
    if (invoice.rows.length === 0) return null;
    const items = await this.pool.query(
      'SELECT name, price FROM invoice_items WHERE invoice_id = $1 ORDER BY id',
      [id],
    );
    return new Invoice(
      items.rows.map((row) => ({ name: row.name, price: Number(row.price) })),
      Number(invoice.rows[0].tax_rate),
      id,
    );
  }
}
