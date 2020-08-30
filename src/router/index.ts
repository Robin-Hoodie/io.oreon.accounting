import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import InvoiceList from "@/views/ViewInvoiceList.vue";

const ROUTE_NAMES = {
  INVOICE_LIST: "INVOICE_LIST"
};

const routes: Array<RouteRecordRaw> = [
  {
    path: "/invoices",
    name: ROUTE_NAMES.INVOICE_LIST,
    component: InvoiceList
  },
  {
    path: "/",
    redirect: {
      name: ROUTE_NAMES.INVOICE_LIST
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
