<script setup lang="ts">
import TopHatSvg from "../../assets/magic-top-hat-clipart.svg";

const emit = defineEmits(["click"]);
</script>

<template>
  <button
    @click="emit('click')"
    type="button"
    class="flex items-center uppercase bg-white hover:bg-amber-300 text-xs gap-2 border border-gray-300 hover:scale-110 hover:shadow-sm px-4 py-2 spin-image-on-hover"
  >
    <slot>Fill it out for me</slot>
    <img :src="TopHatSvg" height="30" width="30" />
  </button>
</template>

<style lang="css" scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spin-image-on-hover:hover {
  & > img {
    animation: spin 1.5s linear infinite;
  }
}
</style>
