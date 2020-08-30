export class Invoice {
  // TODO: Should not have to use this?
  // eslint-disable-next-line no-useless-constructor
  public constructor (readonly number: number, readonly invoiceDate: Date, readonly dueDate: Date, readonly supplier: string, readonly amount: number, readonly currency: Currency, readonly description?: string) {}

  get price () {
    if (this.currency.suffixed) {
      return `${this.amount.toFixed(2)}${this.currency.symbol}`;
    }
    return `${this.currency.symbol}${this.amount.toFixed(2)}`;
  }
}

export class Currency {
  static readonly EUR = new Currency("EUR", "€");
  static readonly USD = new Currency("USD", "$");
  static readonly NOK = new Currency("NOK", "kr", true);

  // TODO: Should not have to use this?
  // eslint-disable-next-line no-useless-constructor
  private constructor (private readonly key: string, public readonly symbol: string, public readonly suffixed = false) {}
}
