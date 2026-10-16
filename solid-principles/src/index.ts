import { createPool, initSchema } from './db';
import { Notification, EmailService, SmsService } from './dip/notifications';
import { HumanWorker, RobotWorker, lunchBreak, runShift } from './isp/workers';
import { DiscountCalculator } from './ocp/DiscountCalculator';
import { GoldDiscount, PlatinumDiscount, RegularDiscount, SilverDiscount } from './ocp/discounts';
import { Invoice } from './srp/Invoice';
import { InvoiceCalculator } from './srp/InvoiceCalculator';
import { InvoiceRepository } from './srp/InvoiceRepository';

async function main(): Promise<void> {
  console.log('--- SRP: счет-фактура (PostgreSQL) ---');
  const pool = createPool();
  try {
    await initSchema(pool);
    await pool.query('TRUNCATE invoices RESTART IDENTITY CASCADE');
    const repository = new InvoiceRepository(pool);
    const calculator = new InvoiceCalculator();

    const invoice = new Invoice(
      [{ name: 'Ноутбук', price: 450000 }, { name: 'Мышь', price: 7500 }, { name: 'Монитор', price: 120000 }],
      0.12,
    );
    await repository.save(invoice);
    const loaded = await repository.findById(invoice.id!);
    console.log(`Счет #${loaded!.id}: позиций ${loaded!.items.length}`);
    console.log(`Без НДС: ${calculator.calculateSubtotal(loaded!)}`);
    console.log(`НДС 12%: ${calculator.calculateTax(loaded!)}`);
    console.log(`Итого:   ${calculator.calculateTotal(loaded!)}`);
  } finally {
    await pool.end();
  }

  console.log('--- OCP: скидки для суммы 100000 ---');
  const discounts = new DiscountCalculator();
  const policies = [new RegularDiscount(), new SilverDiscount(), new GoldDiscount(), new PlatinumDiscount()];
  for (const policy of policies) {
    console.log(`${policy.constructor.name}: ${discounts.calculateDiscount(policy, 100000)}`);
  }

  console.log('--- ISP: рабочая смена ---');
  const human = new HumanWorker('Иван');
  runShift([human, new RobotWorker('R2')]);
  lunchBreak([human]); // робота сюда передать нельзя - ошибка компиляции

  console.log('--- DIP: уведомления ---');
  new Notification(new EmailService()).send('Счет №1 выставлен');
  new Notification(new SmsService()).send('Счет №1 выставлен');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
