import { createPool, initSchema } from './db';
import { EmployeeRepository } from './EmployeeRepository';
import { Manager } from './models/Manager';
import { Worker } from './models/Worker';
import { PayrollService } from './PayrollService';

async function main(): Promise<void> {
  const pool = createPool();
  try {
    await initSchema(pool);
    const repository = new EmployeeRepository(pool);
    const payrollService = new PayrollService(repository);
    await repository.clear(); // каждый запуск демонстрации начинается с пустой таблицы

    await payrollService.addEmployee(new Worker('Ахметов Данияр', 'Электромонтер', 2500, 160));
    await payrollService.addEmployee(new Worker('Иванова Мария', 'Оператор станка', 3200, 152));
    await payrollService.addEmployee(new Worker('Сериков Тимур', 'Сварщик', 4000, 120.5));
    await payrollService.addEmployee(new Manager('Касымова Айгерим', 'Начальник цеха', 650000, 150000));
    await payrollService.addEmployee(new Manager('Петров Олег', 'Руководитель проекта', 800000, 0));

    const payroll = await payrollService.getPayroll();
    console.log('Ведомость по зарплате');
    console.table(
      payroll.map(({ employee, salary }) => ({
        ID: employee.id,
        'Имя': employee.name,
        'Должность': employee.position,
        'Класс': employee.constructor.name,
        'Зарплата, тг': salary.toFixed(2),
      })),
    );
    console.log(`Итого фонд оплаты труда: ${(await payrollService.getTotal()).toFixed(2)} тг`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
