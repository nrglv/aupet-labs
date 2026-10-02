import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Employee } from '../src/models/Employee';
import { Manager } from '../src/models/Manager';
import { Worker } from '../src/models/Worker';

test('Рабочий: зарплата = ставка за час * часы', () => {
  assert.equal(new Worker('Ахметов Данияр', 'Электромонтер', 2500, 160).calculateSalary(), 400000);
  assert.equal(new Worker('Сериков Тимур', 'Сварщик', 4000, 120.5).calculateSalary(), 482000);
});

test('Рабочий без отработанных часов получает 0', () => {
  assert.equal(new Worker('Иванова Мария', 'Оператор станка', 3200, 0).calculateSalary(), 0);
});

test('Менеджер: зарплата = фиксированная зарплата + премия', () => {
  assert.equal(new Manager('Касымова Айгерим', 'Начальник цеха', 650000, 150000).calculateSalary(), 800000);
  assert.equal(new Manager('Петров Олег', 'Руководитель проекта', 800000, 0).calculateSalary(), 800000);
});

test('Наследование: рабочий и менеджер являются сотрудниками', () => {
  assert.ok(new Worker('А', 'Б', 1, 1) instanceof Employee);
  assert.ok(new Manager('А', 'Б', 1, 1) instanceof Employee);
});

test('Полиморфизм: один вызов calculateSalary() для списка Employee[]', () => {
  const employees: Employee[] = [
    new Worker('Ахметов Данияр', 'Электромонтер', 2500, 160),
    new Manager('Касымова Айгерим', 'Начальник цеха', 650000, 150000),
  ];
  assert.deepEqual(employees.map((e) => e.calculateSalary()), [400000, 800000]);
});

test('Некорректные данные отклоняются', () => {
  assert.throws(() => new Worker('', 'Сварщик', 100, 10), /Имя/);
  assert.throws(() => new Worker('А', 'Сварщик', -100, 10), /ставка/);
  assert.throws(() => new Manager('А', 'Директор', 100, -1), /премия/);
});
