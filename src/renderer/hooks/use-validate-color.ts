import validateColor, { validateHTMLColorHex } from "validate-color";
import { ref } from "vue";

export function useValidateColor(color: string) {
  const valid = ref(false);

  /** If the value of the string is equal to 000000, we still consider it a valid color. */
  if (validateHTMLColorHex(`#${color}`)) {
    valid.value = true;
  } else {
    valid.value = validateColor(color);
  }
  return valid.value;
}
