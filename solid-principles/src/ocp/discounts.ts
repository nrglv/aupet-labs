/**
 * OCP: каждый тип клиента - отдельная реализация интерфейса DiscountPolicy.
 * Новый тип добавляется новым классом, существующий код не меняется.
 */
export interface DiscountPolicy {
  apply(amount: number): number;
}

export class RegularDiscount implements DiscountPolicy {
  apply(amount: number): number {
    return amount;
  }
}

/** Общий код процентных скидок, чтобы не повторять формулу в каждом классе (DRY). */
abstract class PercentDiscount implements DiscountPolicy {
  protected abstract readonly percent: number;

  apply(amount: number): number {
    return amount * (1 - this.percent / 100);
  }
}

export class SilverDiscount extends PercentDiscount {
  protected readonly percent = 10;
}

export class GoldDiscount extends PercentDiscount {
  protected readonly percent = 20;
}

/** Новый тип клиента: добавлен без изменения DiscountCalculator и других классов. */
export class PlatinumDiscount extends PercentDiscount {
  protected readonly percent = 30;
}
