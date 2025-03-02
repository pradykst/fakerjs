<script setup lang="ts">
type Props = {
  id: string;
  label: string;
  name?: string;
  description?: string;
};
const props = defineProps<Props>();
const model = defineModel({ required: true });
</script>

<template>
  <div class="relative flex items-start">
    <div class="flex h-6 items-center">
      <input
        v-model="model"
        :id="id"
        :aria-describedby="`${id}-description`"
        :name="name"
        type="checkbox"
        class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
      />
    </div>
    <div class="ml-3 text-sm leading-6">
      <label :for="id" class="font-medium text-gray-900">{{ label }}</label>
      <p v-if="description" :id="`${id}-description`" class="text-gray-500">
        {{ description }}
      </p>
    </div>
  </div>
</template>
