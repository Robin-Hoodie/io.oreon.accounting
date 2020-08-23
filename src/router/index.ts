import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Invoice from "@/views/Invoice.vue";

const ROUTE_NAMES = {
  invoice: "invoice"
};

const routes: Array<RouteRecordRaw> = [
  {
    path: "/invoice",
    name: ROUTE_NAMES.invoice,
    component: Invoice
  },
  {
    path: "/",
    redirect: "/invoice"
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
