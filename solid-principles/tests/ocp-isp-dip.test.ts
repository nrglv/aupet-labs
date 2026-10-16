import assert from 'node:assert/strict';
import { test } from 'node:test';
import { EmailService, MessageSender, Notification, SmsService } from '../src/dip/notifications';
import { HumanWorker, RobotWorker, lunchBreak, runShift } from '../src/isp/workers';
import { DiscountCalculator } from '../src/ocp/DiscountCalculator';
import { DiscountPolicy, GoldDiscount, PlatinumDiscount, RegularDiscount, SilverDiscount } from '../src/ocp/discounts';

const calculator = new DiscountCalculator();

test('OCP: скидки Regular, Silver, Gold, Platinum', () => {
  assert.equal(calculator.calculateDiscount(new RegularDiscount(), 1000), 1000);
  assert.equal(calculator.calculateDiscount(new SilverDiscount(), 1000), 900);
  assert.equal(calculator.calculateDiscount(new GoldDiscount(), 1000), 800);
  assert.equal(calculator.calculateDiscount(new PlatinumDiscount(), 1000), 700);
});

test('OCP: новая политика подключается без изменения калькулятора', () => {
  const blackFriday: DiscountPolicy = { apply: (amount) => amount / 2 };
  assert.equal(calculator.calculateDiscount(blackFriday, 1000), 500);
});

test('OCP: отрицательная сумма отклоняется', () => {
  assert.throws(() => calculator.calculateDiscount(new GoldDiscount(), -1), /неотрицательным/);
});

test('ISP: человек и робот работают в одной смене', (t) => {
  const log = t.mock.method(console, 'log', () => {});
  runShift([new HumanWorker('Иван'), new RobotWorker('R2')]);
  assert.deepEqual(log.mock.calls.map((c) => c.arguments[0]), ['Иван работает', 'Робот R2 работает']);
});

test('ISP: у робота нет методов eat и sleep', (t) => {
  t.mock.method(console, 'log', () => {});
  const robot = new RobotWorker('R2');
  assert.equal('eat' in robot, false);
  assert.equal('sleep' in robot, false);
  lunchBreak([new HumanWorker('Иван')]);
});

test('DIP: Notification работает с Email и SMS', (t) => {
  const log = t.mock.method(console, 'log', () => {});
  new Notification(new EmailService()).send('Привет');
  new Notification(new SmsService()).send('Привет');
  assert.deepEqual(log.mock.calls.map((c) => c.arguments[0]), ['Отправка Email: Привет', 'Отправка SMS: Привет']);
});

test('DIP: в Notification можно подставить тестовую реализацию', () => {
  const sent: string[] = [];
  const fake: MessageSender = { send: (message) => sent.push(message) };
  new Notification(fake).send('Тест');
  assert.deepEqual(sent, ['Тест']);
});
