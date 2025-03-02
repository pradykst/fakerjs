<script lang="ts" setup>
import ItemsList from "@/components/molecules/ItemsList.vue";
import RecipientDetails from "@/components/molecules/RecipientDetails.vue";
import { useDeliveryDetailsState } from "@/composables/useDeliveryDetailsState";
import type { DeliveryDetails } from "@/types";
import { computed } from "vue";

type Props = {
  taxesAndFeesRatio?: number;
  initialDetails?: Partial<DeliveryDetails>;
};

const props = withDefaults(defineProps<Props>(), {
  taxesAndFeesRatio: 0.15,
});

const deliveryDetails = useDeliveryDetailsState(props.initialDetails);

const isReadyForSubmission = computed(() => {
  return Object.keys(deliveryDetails.recipientInformation).every(
    (key) => deliveryDetails.recipientInformation[key]?.length > 0,
  );
});

function onSubmit() {
  alert("Submitted!");
}
</script>
<template>
  <form
    @submit.prevent="onSubmit"
    class="flex justify-center my-6 flex-wrap xl:flex-nowrap max-w-5xl mx-2 sm:mx-8 xl:mx-auto border border-gray-400 rounded-2xl p-4"
  >
    <recipient-details
      class="w-full flex-grow pb-8 mb-8 xl:pb-0 xl:mb-0 xl:pr-4 xl:mr-4 border-b xl:border-b-0 xl:border-r border-gray-400"
    />
    <aside class="w-full flex-grow xl:w-auto flex-shrink-0 flex flex-col justify-between">
      <items-list :taxes-and-fees-ratio="taxesAndFeesRatio" class="w-full" />
      <button
        class="self-center disabled:opacity-35 disabled:cursor-not-allowed my-4 rounded-md bg-amber-300 px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:brightness-95"
        :disabled="!isReadyForSubmission"
        type="submit"
      >
        Finalize Order
      </button>
    </aside>
  </form>
</template>
