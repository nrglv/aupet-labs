/** ISP: вместо одного "толстого" интерфейса IWorker - три узких. */
export interface Workable {
  work(): void;
}

export interface Eatable {
  eat(): void;
}

export interface Sleepable {
  sleep(): void;
}

export class HumanWorker implements Workable, Eatable, Sleepable {
  constructor(private readonly name: string) {}

  work(): void {
    console.log(`${this.name} работает`);
  }

  eat(): void {
    console.log(`${this.name} обедает`);
  }

  sleep(): void {
    console.log(`${this.name} спит`);
  }
}

/** Робот реализует только то, что умеет. Заглушки с исключениями больше не нужны. */
export class RobotWorker implements Workable {
  constructor(private readonly model: string) {}

  work(): void {
    console.log(`Робот ${this.model} работает`);
  }
}

/** Клиентский код зависит только от нужного ему интерфейса. */
export function runShift(workers: Workable[]): void {
  workers.forEach((worker) => worker.work());
}

export function lunchBreak(eaters: Eatable[]): void {
  eaters.forEach((eater) => eater.eat());
}
