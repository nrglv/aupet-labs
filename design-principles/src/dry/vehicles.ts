/**
 * DRY: общее поведение транспортных средств описано один раз в базовом классе.
 * Наследники задают только свое название.
 */
export abstract class Vehicle {
  protected constructor(private readonly name: string) {}

  start(): void {
    console.log(`${this.name} is starting`);
  }

  stop(): void {
    console.log(`${this.name} is stopping`);
  }
}

export class Car extends Vehicle {
  constructor() {
    super('Car');
  }
}

export class Truck extends Vehicle {
  constructor() {
    super('Truck');
  }
}
