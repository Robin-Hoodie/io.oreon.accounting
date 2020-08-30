<template>
  <ul class="invoice-list">
    <li
      v-for="invoice of invoices"
      :key="invoice.number"
    >
      {{ invoice.number }}
    </li>
  </ul>
</template>

<script lang="ts">
import { getInvoices } from "@/http";

export default {
  name: "ViewInvoiceList",
  async setup () {
    const invoices = await getInvoices();
    return {
      invoices
    };
  }
};
</script>

<style
  lang="sass"
  scoped
>
.invoice-list
  list-style-type: none
</style>
