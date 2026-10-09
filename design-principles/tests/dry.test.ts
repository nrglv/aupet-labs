import assert from 'node:assert/strict';
import { after, before, beforeEach, test } from 'node:test';
import { createPool, initSchema } from '../src/db';
import { calculateTotal, OrderService } from '../src/dry/OrderService';
import { Car, Truck, Vehicle } from '../src/dry/vehicles';

const pool = createPool();
const service = new OrderService(pool);

before(() => initSchema(pool));
beforeEach(() => pool.query('TRUNCATE orders RESTART IDENTITY'));
after(() => pool.end());

test('calculateTotal: количество * цена', () => {
  assert.equal(calculateTotal(2, 450000), 900000);
  assert.equal(calculateTotal(5, 7500), 37500);
});

test('createOrder сохраняет заказ и выводит сообщение', async (t) => {
  const log = t.mock.method(console, 'log', () => {});
  const order = await service.createOrder('Laptop', 2, 450000);
  assert.deepEqual(order, { id: 1, productName: 'Laptop', quantity: 2, price: 450000, total: 900000 });
  assert.equal(log.mock.calls[0].arguments[0], 'Order for Laptop created. Total: 900000');
});

test('updateOrder пересчитывает стоимость в базе', async (t) => {
  const log = t.mock.method(console, 'log', () => {});
  const { id } = await service.createOrder('Laptop', 2, 450000);
  const updated = await service.updateOrder(id, 'Laptop', 3, 430000);
  assert.equal(updated.total, 1290000);
  assert.equal(log.mock.calls[1].arguments[0], 'Order for Laptop updated. New total: 1290000');
  const { rows } = await pool.query('SELECT total, updated_at FROM orders WHERE id = $1', [id]);
  assert.equal(Number(rows[0].total), 1290000);
  assert.ok(rows[0].updated_at);
});

test('updateOrder несуществующего заказа - ошибка', async () => {
  await assert.rejects(service.updateOrder(999, 'X', 1, 1), /не найден/);
});

test('База не принимает нулевое количество', async (t) => {
  t.mock.method(console, 'log', () => {});
  await assert.rejects(service.createOrder('Laptop', 0, 100), /check constraint/);
});

test('Car и Truck наследуют поведение Vehicle', (t) => {
  const log = t.mock.method(console, 'log', () => {});
  const car = new Car();
  const truck = new Truck();
  assert.ok(car instanceof Vehicle && truck instanceof Vehicle);
  car.start(); car.stop(); truck.start(); truck.stop();
  assert.deepEqual(log.mock.calls.map((c) => c.arguments[0]), [
    'Car is starting', 'Car is stopping', 'Truck is starting', 'Truck is stopping',
  ]);
});
