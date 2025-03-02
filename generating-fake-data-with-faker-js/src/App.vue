<script setup lang="ts">
import DeliveryForm from "@/components/DeliveryForm.vue";
import CheckboxInput from "@/components/atoms/CheckboxInput.vue";
import { useMagicMode } from "@/composables/useMagicMode";

const isUsingMagicMode = useMagicMode();
</script>

<template>
  <main class="flex flex-col">
    <delivery-form
      :initial-details="{
        estimatedDeliveryDate: 'November 22, 2024',
        items: [
          { quantity: 1, name: 'Item 1', priceInCents: 50 },
          { quantity: 1, name: 'Item 2', priceInCents: 4523 },
          { quantity: 3, name: 'Item 3', priceInCents: 1050 },
          { quantity: 13, name: 'Item 4', priceInCents: 25 },
        ],
      }"
    />

    <checkbox-input
      class="mx-auto select-none mt-4 mb-12"
      v-model="isUsingMagicMode"
      id="magic-mode"
      label="Magic Mode"
    />
  </main>
</template>
