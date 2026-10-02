export type EmployeeType = 'worker' | 'manager';

/**
 * Базовый класс "Сотрудник".
 * Абстрактный: создать "просто сотрудника" нельзя,
 * а способ расчета зарплаты определяет каждый наследник.
 */
export abstract class Employee {
  /** Идентификатор присваивает база данных при сохранении. */
  public id: number | null = null;

  constructor(
    public readonly name: string,
    public readonly position: string,
  ) {
    if (name.trim() === '') throw new Error('Имя сотрудника не может быть пустым');
    if (position.trim() === '') throw new Error('Должность не может быть пустой');
  }

  /** Тип сотрудника - значение столбца type в таблице employees. */
  abstract get type(): EmployeeType;

  /** Расчет зарплаты за месяц. Реализуется в производных классах. */
  abstract calculateSalary(): number;

  /** Общий для всех наследников метод, использующий полиморфный calculateSalary(). */
  describe(): string {
    const id = this.id ?? '-';
    return `#${id} ${this.name}, ${this.position}: ${this.calculateSalary().toFixed(2)} тг`;
  }
}

export function assertNonNegative(value: number, field: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`Поле "${field}" должно быть неотрицательным числом`);
  }
}
