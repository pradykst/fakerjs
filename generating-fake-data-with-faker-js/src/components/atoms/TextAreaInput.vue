<script lang="ts" setup>
type Props = {
  label: string;
};
const model = defineModel<string>();
const props = defineProps<Props>();
</script>

<template>
  <label class="block text-sm font-medium leading-6 text-gray-900">
    {{ label }}
    <textarea
      v-model="model"
      class="mt-2 block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    />
  </label>
</template>
