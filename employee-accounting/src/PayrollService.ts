import { Employee } from './models/Employee';
import { EmployeeRepository } from './EmployeeRepository';

export interface PayrollLine {
  employee: Employee;
  salary: number;
}

/**
 * Расчет зарплаты. Сервис работает только с базовым типом Employee
 * и не знает, рабочий перед ним или менеджер, - это и есть полиморфизм.
 */
export class PayrollService {
  constructor(private readonly repository: EmployeeRepository) {}

  addEmployee(employee: Employee): Promise<Employee> {
    return this.repository.add(employee);
  }

  async getPayroll(): Promise<PayrollLine[]> {
    const employees = await this.repository.findAll();
    return employees.map((employee) => ({ employee, salary: employee.calculateSalary() }));
  }

  async getTotal(): Promise<number> {
    const payroll = await this.getPayroll();
    return payroll.reduce((sum, line) => sum + line.salary, 0);
  }
}
