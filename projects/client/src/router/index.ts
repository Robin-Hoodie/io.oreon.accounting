import {createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import ViewInvoiceList from "@/views/ViewInvoiceList.vue";
import ViewInvoiceUpload from "@/views/ViewInvoiceUpload.vue";

const ROUTE_NAMES = {
  INVOICE_LIST: "INVOICE_LIST",
  INVOICE_UPLOAD: "INVOICE_UPLOAD"
};

const routes: Array<RouteRecordRaw> = [
  {
    path: "/invoices/list",
    name: ROUTE_NAMES.INVOICE_LIST,
    component: ViewInvoiceList
  },
  {
    path: "/invoices/upload",
    name: ROUTE_NAMES.INVOICE_UPLOAD,
    component: ViewInvoiceUpload
  },
  {
    path: "/",
    redirect: {
      name: ROUTE_NAMES.INVOICE_UPLOAD
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
