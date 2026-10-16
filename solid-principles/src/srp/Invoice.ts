export interface Item {
  name: string;
  price: number;
}

/**
 * SRP: Invoice только представляет данные счета-фактуры.
 * Он не считает сумму и не знает, как и где его хранят.
 */
export class Invoice {
  constructor(
    public readonly items: Item[],
    public readonly taxRate: number,
    public id: number | null = null,
  ) {}
}
