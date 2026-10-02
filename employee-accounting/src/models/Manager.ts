import { Employee, EmployeeType, assertNonNegative } from './Employee';

/** Менеджер: зарплата = фиксированная зарплата + премия. */
export class Manager extends Employee {
  constructor(
    name: string,
    position: string,
    public readonly fixedSalary: number,
    public readonly bonus: number,
  ) {
    super(name, position);
    assertNonNegative(fixedSalary, 'фиксированная зарплата');
    assertNonNegative(bonus, 'премия');
  }

  get type(): EmployeeType {
    return 'manager';
  }

  calculateSalary(): number {
    return this.fixedSalary + this.bonus;
  }
}
