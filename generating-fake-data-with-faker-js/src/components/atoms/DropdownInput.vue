<script lang="ts" setup>
type Prop = {
  label: string;
  options: readonly string[];
};
defineProps<Prop>();
const model = defineModel<string>();
</script>

<template>
  <label class="block text-sm font-medium leading-6 text-gray-900">
    {{ label }}
    <select
      v-model="model"
      class="mt-2 block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
    >
      <option v-for="option in options">{{ option }}</option>
    </select>
  </label>
</template>
