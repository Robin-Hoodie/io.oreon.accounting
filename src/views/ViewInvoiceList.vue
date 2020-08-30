<template>
  <ul class="invoice-list">
    <li
      v-for="invoice of invoices"
      :key="invoice.number"
      class="invoice-list-item"
    >
      <div class="invoice-number">
        {{ invoice.number }}
      </div>
      <div class="invoice-supplier">
        {{ invoice.supplier }}
      </div>
      <div>
        <span class="invoice-price">{{ invoice.price }}</span>
        &nbsp;
        <span>{{ invoice.description }}</span>
      </div>
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
$distance-from-side: 4px

.invoice-list
  list-style-type: none

.invoice-list-item
  border: 1px solid black
  margin: 0.5rem 0
  padding: 2rem
  position: relative

.invoice-number
  position: absolute
  font-weight: bold
  font-size: 0.8rem
  top: $distance-from-side
  left: $distance-from-side

.invoice-supplier
  position: absolute
  font-weight: bold
  top: $distance-from-side
  right: $distance-from-side

.invoice-price
  font-size: 0.95rem
</style>
