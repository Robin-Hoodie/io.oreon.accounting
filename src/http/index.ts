import type { Invoice } from "@/model/invoice";

export const http = {
  // Mimic API call
  get<T extends object> (data: T): Promise<T> {
    return new Promise(resolve => setTimeout(() => resolve(data), Math.random() * 1000 + 1000));
  }
};

const getRandomYear = () => Math.round(Math.random() * 20) + 2000;
const getRandomMonth = () => Math.round(Math.random() * 11);
const getRandomDay = () => Math.round(Math.random() * 28);
const getRandomDate = () => new Date(getRandomYear(), getRandomMonth(), getRandomDay());

export const getInvoices = async () => {
  return http.get([
    {
      number: 20001,
      invoiceDate: getRandomDate(),
      dueDate: getRandomDate(),
      supplier: "SD Worx"
    },
    {
      number: 20002,
      invoiceDate: getRandomDate(),
      dueDate: getRandomDate(),
      supplier: "Coolblue"
    },
    {
      number: 20003,
      invoiceDate: getRandomDate(),
      dueDate: getRandomDate(),
      supplier: "bol.com"
    }
  ]);
};
