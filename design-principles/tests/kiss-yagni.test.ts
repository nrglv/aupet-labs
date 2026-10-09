import assert from 'node:assert/strict';
import { test } from 'node:test';
import { add } from '../src/kiss/calculator';
import { doSomething } from '../src/kiss/worker';
import { circleArea, squareArea } from '../src/yagni/shapes';

test('KISS: add складывает числа', () => {
  assert.equal(add(2, 3), 5);
  assert.equal(add(-4, 4), 0);
});

test('KISS: doSomething выводит сообщение', (t) => {
  const log = t.mock.method(console, 'log', () => {});
  doSomething();
  assert.equal(log.mock.calls[0].arguments[0], 'Doing something...');
});

test('YAGNI: площадь круга и квадрата', () => {
  assert.equal(circleArea(1), Math.PI);
  assert.ok(Math.abs(circleArea(2) - 12.566370614359172) < 1e-12);
  assert.equal(squareArea(3), 9);
});

test('YAGNI: add ничего не выводит сам', (t) => {
  const log = t.mock.method(console, 'log', () => {});
  assert.equal(add(10, 20), 30);
  assert.equal(log.mock.callCount(), 0);
});
