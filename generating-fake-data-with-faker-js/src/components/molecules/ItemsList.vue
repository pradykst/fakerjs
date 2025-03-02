<script lang="ts" setup>
import { computed } from "vue";
import MagicButton from "@/components/atoms/MagicButton.vue";
import { asCurrency } from "@/helpers";
import { useMagicMode } from "@/composables/useMagicMode";
import { useDeliveryDetailsState } from "@/composables/useDeliveryDetailsState";
import { FakerWrapper } from "@/FakerWrapper";

type Props = {
  taxesAndFeesRatio: number;
};
const props = defineProps<Props>();
const deliveryDetails = useDeliveryDetailsState();
const isUsingMagicMode = useMagicMode();

function populateWithFakeValues() {
  const fakerWrapper = new FakerWrapper();
  deliveryDetails.items = fakerWrapper.items();
  deliveryDetails.estimatedDeliveryDate = fakerWrapper.estimatedDeliveryDate();
}

const subtotal = computed(() =>
  deliveryDetails.items.reduce((total, item) => total + item.priceInCents * item.quantity, 0),
);
const taxesAndFees = computed(() => subtotal.value * props.taxesAndFeesRatio);
const total = computed(() => subtotal.value + taxesAndFees.value);

function formatCurrency(costInCents: number): string {
  if (costInCents === 0) {
    return "Free";
  }

  return asCurrency(costInCents);
}
</script>

<template>
  <section class="self-start overflow-x-scroll min-w-80">
    <header class="flex items-center justify-between mb-4 min-h-14">
      <h2 class="text-base font-semibold leading-7 text-gray-900">Items</h2>
      <magic-button v-if="isUsingMagicMode" @click="populateWithFakeValues">Fill it out for me</magic-button>
    </header>

    <p class="text-base leading-7 text-gray-900">
      Arriving on <strong>{{ deliveryDetails.estimatedDeliveryDate }}</strong>
    </p>

    <table class="min-w-full divide-y divide-gray-300">
      <thead>
        <tr>
          <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900" scope="col">Qty</th>
          <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900" scope="col">Name</th>
          <th class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900" scope="col">Cost</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-if="deliveryDetails.items.length === 0">
          <td class="whitespace-nowrap py-12 px-3 bg-amber-100/35 text-sm font-medium text-gray-900" colspan="3">
            No items yet. Your shopping cart is empty!
          </td>
        </tr>
        <tr v-for="item in deliveryDetails.items">
          <td class="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
            {{ item.quantity }}
          </td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            {{ item.name }}
          </td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
            {{ formatCurrency(item.priceInCents * item.quantity) }}
          </td>
        </tr>
        <tr></tr>
        <tr>
          <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0" colspan="2">
            Subtotal
          </td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
            {{ formatCurrency(subtotal) }}
          </td>
        </tr>
        <tr>
          <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0" colspan="2">
            Taxes and Fees
          </td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
            {{ formatCurrency(taxesAndFees) }}
          </td>
        </tr>
        <tr></tr>
        <tr>
          <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0" colspan="2">Total</td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-right font-medium">
            {{ formatCurrency(total) }}
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
