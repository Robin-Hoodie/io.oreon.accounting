import { Invoice, Currency } from "@/model/invoice";

export const http = {
  // Mimic API call
  get<T extends object> (data: T, withTimeout = false): Promise<T> {
    if (withTimeout) {
      return new Promise(resolve => setTimeout(() => resolve(data), Math.random() * 1000 + 1000));
    }
    return Promise.resolve(data);
  }
};

const getRandomYear = () => Math.round(Math.random() * 20) + 2000;
const getRandomMonth = () => Math.round(Math.random() * 11);
const getRandomDay = () => Math.round(Math.random() * 28);
const getRandomDate = () => new Date(getRandomYear(), getRandomMonth(), getRandomDay());

export const getInvoices = async (): Promise<Invoice[]> => {
  return http.get<Invoice[]>([
    new Invoice(20001, getRandomDate(), getRandomDate(), "SD Worx", 87.00, Currency.EUR, "juli-2020.pdf", "Beheer loon en BVH Juli 2020"),
    new Invoice(20002, getRandomDate(), getRandomDate(), "Coolblue", 210.00, Currency.EUR, "macbook.pdf", "Macbook Pro 2020"),
    new Invoice(20003, getRandomDate(), getRandomDate(), "bol.com", 300.00, Currency.USD, "monitor.pdf")
  ]);
};
