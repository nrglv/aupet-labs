import { DiscountPolicy } from './discounts';

/**
 * OCP: калькулятор закрыт для модификации - в нем нет ветвлений по типу клиента.
 * Открыт для расширения - принимает любую реализацию DiscountPolicy.
 */
export class DiscountCalculator {
  calculateDiscount(policy: DiscountPolicy, amount: number): number {
    if (!Number.isFinite(amount) || amount < 0) {
      throw new Error('Сумма должна быть неотрицательным числом');
    }
    return policy.apply(amount);
  }
}
