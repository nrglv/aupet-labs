import assert from 'node:assert/strict';
import { after, before, beforeEach, test } from 'node:test';
import { createPool, initSchema } from '../src/db';
import { Invoice } from '../src/srp/Invoice';
import { InvoiceCalculator } from '../src/srp/InvoiceCalculator';
import { InvoiceRepository } from '../src/srp/InvoiceRepository';

const pool = createPool();
const repository = new InvoiceRepository(pool);
const calculator = new InvoiceCalculator();

before(() => initSchema(pool));
beforeEach(() => pool.query('TRUNCATE invoices RESTART IDENTITY CASCADE'));
after(() => pool.end());

const sample = () => new Invoice([{ name: 'Ноутбук', price: 1000 }, { name: 'Мышь', price: 500 }], 0.12);

test('InvoiceCalculator: сумма, налог и итог', () => {
  const invoice = sample();
  assert.equal(calculator.calculateSubtotal(invoice), 1500);
  assert.equal(calculator.calculateTax(invoice), 180);
  assert.equal(calculator.calculateTotal(invoice), 1680);
});

test('InvoiceCalculator: пустой счет', () => {
  assert.equal(calculator.calculateTotal(new Invoice([], 0.12)), 0);
});

test('InvoiceRepository: сохранение и чтение счета с позициями', async () => {
  const saved = await repository.save(sample());
  assert.equal(saved.id, 1);
  const loaded = await repository.findById(1);
  assert.deepEqual(loaded, new Invoice(sample().items, 0.12, 1));
  assert.equal(calculator.calculateTotal(loaded!), 1680);
});

test('InvoiceRepository: несуществующий счет', async () => {
  assert.equal(await repository.findById(999), null);
});

test('InvoiceRepository: ошибка в позиции откатывает весь счет', async () => {
  const bad = new Invoice([{ name: 'Ноутбук', price: 1000 }, { name: 'Брак', price: -1 }], 0.12);
  await assert.rejects(repository.save(bad), /check constraint/);
  const { rows } = await pool.query('SELECT count(*)::int AS n FROM invoices');
  assert.equal(rows[0].n, 0);
});
