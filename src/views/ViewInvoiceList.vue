<template>
  <ul class="invoice-list">
    <li
      v-for="invoice of invoices"
      :key="invoice.number"
      class="invoice-list-card"
    >
      <div class="invoice-top">
        <div class="invoice-number">
          {{ invoice.number }}
        </div>
        <div class="invoice-price">
          {{ invoice.price }}
        </div>
      </div>
      <div />
      <div class="invoice-description">
        <span class="invoice-supplier">{{ invoice.supplier }}</span>
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
.invoice-list
  width: 100%
  list-style-type: none
  padding-left: 0
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))
  gap: 1rem

.invoice-list-card
  border: 1px solid black
  padding: 1rem
  box-shadow: 4px 4px 2px 2px #ddd
  transition: transform 300ms ease-in-out
  cursor: pointer
  &:hover
    transform: scale(1.03)

.invoice-top
  display: flex
  justify-content: space-between

.invoice-number
  font-weight: bold
  font-size: 0.8rem

.invoice-supplier
  font-weight: bold

.invoice-description
  display: flex
  justify-content: space-between

.invoice-price
  font-size: 0.95rem
</style>
