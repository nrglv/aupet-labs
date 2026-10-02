import assert from 'node:assert/strict';
import { after, before, beforeEach, test } from 'node:test';
import { createPool, initSchema } from '../src/db';
import { EmployeeRepository } from '../src/EmployeeRepository';
import { Manager } from '../src/models/Manager';
import { Worker } from '../src/models/Worker';
import { PayrollService } from '../src/PayrollService';

// Интеграционные тесты: работают с настоящей базой PostgreSQL.
const pool = createPool();
const repository = new EmployeeRepository(pool);
const payrollService = new PayrollService(repository);

before(() => initSchema(pool));
beforeEach(() => repository.clear());
after(() => pool.end());

test('При добавлении база выдает идентификатор', async () => {
  const worker = await payrollService.addEmployee(new Worker('Ахметов Данияр', 'Электромонтер', 2500, 160));
  const manager = await payrollService.addEmployee(new Manager('Петров Олег', 'Руководитель проекта', 800000, 0));
  assert.equal(worker.id, 1);
  assert.equal(manager.id, 2);
});

test('Из базы восстанавливается объект того же класса', async () => {
  await payrollService.addEmployee(new Worker('Сериков Тимур', 'Сварщик', 4000, 120.5));
  await payrollService.addEmployee(new Manager('Касымова Айгерим', 'Начальник цеха', 650000, 150000));

  const [worker, manager] = await repository.findAll();
  assert.ok(worker instanceof Worker);
  assert.ok(manager instanceof Manager);
  assert.equal(worker.calculateSalary(), 482000);
  assert.equal(manager.calculateSalary(), 800000);
});

test('Поиск по идентификатору', async () => {
  const saved = await payrollService.addEmployee(new Worker('Иванова Мария', 'Оператор станка', 3200, 152));
  const found = await repository.findById(saved.id!);
  assert.equal(found?.name, 'Иванова Мария');
  assert.equal(found?.calculateSalary(), 486400);
  assert.equal(await repository.findById(999), null);
});

test('Ведомость и общий фонд оплаты труда', async () => {
  await payrollService.addEmployee(new Worker('Ахметов Данияр', 'Электромонтер', 2500, 160));
  await payrollService.addEmployee(new Manager('Касымова Айгерим', 'Начальник цеха', 650000, 150000));

  const payroll = await payrollService.getPayroll();
  assert.deepEqual(payroll.map((line) => line.salary), [400000, 800000]);
  assert.equal(await payrollService.getTotal(), 1200000);
});

test('Ограничения таблицы не пропускают несогласованную строку', async () => {
  await assert.rejects(
    pool.query(`INSERT INTO employees (name, position, type, fixed_salary, bonus)
                VALUES ('X', 'Y', 'worker', 100, 10)`),
    /employee_fields_match_type/,
  );
});
