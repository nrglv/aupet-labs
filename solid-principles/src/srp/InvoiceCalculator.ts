import { Invoice } from './Invoice';

/** SRP: единственная ответственность - расчет суммы счета-фактуры. */
export class InvoiceCalculator {
  calculateSubtotal(invoice: Invoice): number {
    return invoice.items.reduce((sum, item) => sum + item.price, 0);
  }

  calculateTax(invoice: Invoice): number {
    return this.calculateSubtotal(invoice) * invoice.taxRate;
  }

  calculateTotal(invoice: Invoice): number {
    return this.calculateSubtotal(invoice) + this.calculateTax(invoice);
  }
}
