import { ref } from "vue";

const isUsingMagicMode = ref<boolean>(false);

export function useMagicMode() {
  return isUsingMagicMode;
}
