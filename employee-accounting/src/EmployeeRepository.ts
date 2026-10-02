import { Pool } from 'pg';
import { Employee } from './models/Employee';
import { Manager } from './models/Manager';
import { Worker } from './models/Worker';

/** Строка таблицы employees. NUMERIC драйвер pg возвращает строкой. */
interface EmployeeRow {
  id: number;
  name: string;
  position: string;
  type: string;
  hourly_rate: string | null;
  hours_worked: string | null;
  fixed_salary: string | null;
  bonus: string | null;
}

/** Слой доступа к данным: сохраняет и восстанавливает объекты иерархии Employee. */
export class EmployeeRepository {
  constructor(private readonly pool: Pool) {}

  /** Сохраняет сотрудника и записывает в объект выданный базой идентификатор. */
  async add(employee: Employee): Promise<Employee> {
    const isWorker = employee instanceof Worker;
    const isManager = employee instanceof Manager;
    const result = await this.pool.query<{ id: number }>(
      `INSERT INTO employees
         (name, position, type, hourly_rate, hours_worked, fixed_salary, bonus)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [
        employee.name,
        employee.position,
        employee.type,
        isWorker ? employee.hourlyRate : null,
        isWorker ? employee.hoursWorked : null,
        isManager ? employee.fixedSalary : null,
        isManager ? employee.bonus : null,
      ],
    );
    employee.id = result.rows[0].id;
    return employee;
  }

  async findAll(): Promise<Employee[]> {
    const result = await this.pool.query<EmployeeRow>('SELECT * FROM employees ORDER BY id');
    return result.rows.map(toEmployee);
  }

  async findById(id: number): Promise<Employee | null> {
    const result = await this.pool.query<EmployeeRow>(
      'SELECT * FROM employees WHERE id = $1',
      [id],
    );
    return result.rows.length > 0 ? toEmployee(result.rows[0]) : null;
  }

  async clear(): Promise<void> {
    await this.pool.query('TRUNCATE employees RESTART IDENTITY');
  }
}

/** Фабрика: по значению столбца type создает объект нужного класса. */
function toEmployee(row: EmployeeRow): Employee {
  let employee: Employee;
  switch (row.type) {
    case 'worker':
      employee = new Worker(row.name, row.position, Number(row.hourly_rate), Number(row.hours_worked));
      break;
    case 'manager':
      employee = new Manager(row.name, row.position, Number(row.fixed_salary), Number(row.bonus));
      break;
    default:
      throw new Error(`Неизвестный тип сотрудника: ${row.type}`);
  }
  employee.id = row.id;
  return employee;
}
