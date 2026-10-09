import { createPool, initSchema } from './db';
import { OrderService } from './dry/OrderService';
import { Car, Truck } from './dry/vehicles';
import { add } from './kiss/calculator';
import { doSomething } from './kiss/worker';
import { circleArea, squareArea } from './yagni/shapes';

async function main(): Promise<void> {
  console.log('--- DRY: заказы (PostgreSQL) ---');
  const pool = createPool();
  try {
    await initSchema(pool);
    await pool.query('TRUNCATE orders RESTART IDENTITY');
    const orders = new OrderService(pool);
    const laptop = await orders.createOrder('Laptop', 2, 450000);
    await orders.createOrder('Mouse', 5, 7500);
    await orders.updateOrder(laptop.id, 'Laptop', 3, 430000);
  } finally {
    await pool.end();
  }

  console.log('--- DRY: транспорт ---');
  for (const vehicle of [new Car(), new Truck()]) {
    vehicle.start();
    vehicle.stop();
  }

  console.log('--- KISS ---');
  console.log(add(2, 3));
  doSomething();

  console.log('--- YAGNI ---');
  console.log(`Circle area: ${circleArea(2).toFixed(2)}`);
  console.log(`Square area: ${squareArea(3)}`);
  // логирование - забота вызывающего кода, а не параметр shouldLog у add()
  console.log(`Result: ${add(10, 20)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
