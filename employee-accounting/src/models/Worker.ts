import { Employee, EmployeeType, assertNonNegative } from './Employee';

/** Рабочий: зарплата = ставка за час * количество отработанных часов. */
export class Worker extends Employee {
  constructor(
    name: string,
    position: string,
    public readonly hourlyRate: number,
    public readonly hoursWorked: number,
  ) {
    super(name, position);
    assertNonNegative(hourlyRate, 'ставка за час');
    assertNonNegative(hoursWorked, 'количество часов');
  }

  get type(): EmployeeType {
    return 'worker';
  }

  calculateSalary(): number {
    return this.hourlyRate * this.hoursWorked;
  }
}
