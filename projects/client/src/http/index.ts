import axios, { AxiosResponse } from "axios";
import { Invoice } from "@/model/invoice";

const invoicesBaseUrl = "/oreon-invoices/invoices-incoming";

const responseInterceptor = ((response: AxiosResponse) => response.data);

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL
});

axiosInstance.interceptors.response.use(responseInterceptor);

export const http = {
  // Mimic API call
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get<T extends any> (data: T, withTimeout = false): Promise<T> {
    if (withTimeout) {
      return new Promise((resolve) => setTimeout(() => resolve(data), Math.random() * 1000 + 1000));
    }
    return Promise.resolve(data);
  }
};

// const getRandomYear = () => Math.round(Math.random() * 20) + 2000;
// const getRandomMonth = () => Math.round(Math.random() * 11);
// const getRandomDay = () => Math.round(Math.random() * 28);
// const getRandomDate = () => new Date(getRandomYear(), getRandomMonth(), getRandomDay());

export const getInvoices = async (): Promise<Invoice[]> => {
  return axiosInstance.get(`${invoicesBaseUrl}/years/2020/quarters/Q1/invoices`);
};
