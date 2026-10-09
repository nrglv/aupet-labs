import { Pool } from 'pg';

export interface Order {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

/** Единственное место, где задана формула стоимости заказа. */
export function calculateTotal(quantity: number, price: number): number {
  return quantity * price;
}

/**
 * DRY: расчет стоимости и сохранение строки заказа вынесены в общие методы,
 * а createOrder и updateOrder отличаются только SQL-запросом и текстом сообщения.
 */
export class OrderService {
  constructor(private readonly pool: Pool) {}

  async createOrder(productName: string, quantity: number, price: number): Promise<Order> {
    const order = await this.save(
      `INSERT INTO orders (product_name, quantity, price, total)
       VALUES ($1, $2, $3, $4)
       RETURNING id, product_name, quantity, price, total`,
      [productName, quantity, price, calculateTotal(quantity, price)],
    );
    console.log(`Order for ${order.productName} created. Total: ${order.total}`);
    return order;
  }

  async updateOrder(id: number, productName: string, quantity: number, price: number): Promise<Order> {
    const order = await this.save(
      `UPDATE orders
          SET product_name = $1, quantity = $2, price = $3, total = $4, updated_at = now()
        WHERE id = $5
       RETURNING id, product_name, quantity, price, total`,
      [productName, quantity, price, calculateTotal(quantity, price), id],
    );
    console.log(`Order for ${order.productName} updated. New total: ${order.total}`);
    return order;
  }

  /** Общий для обеих операций код: выполнить запрос и преобразовать строку в Order. */
  private async save(sql: string, params: unknown[]): Promise<Order> {
    const { rows } = await this.pool.query(sql, params);
    if (rows.length === 0) throw new Error('Заказ не найден');
    const row = rows[0];
    return {
      id: row.id,
      productName: row.product_name,
      quantity: row.quantity,
      price: Number(row.price),
      total: Number(row.total),
    };
  }
}
