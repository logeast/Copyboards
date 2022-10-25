import validateColor, { validateHTMLColorHex } from "validate-color";
import { ref } from "vue";

export function useValidateColor(color: string) {
  const trimColor = color.trim();
  const valid = ref(false);
  const text = ref("");

  /** If the value of the string is equal to 000000, we still consider it a valid color. */
  if (validateHTMLColorHex(`#${trimColor.trim()}`)) {
    valid.value = true;
    text.value = `#${trimColor}`;
  } else {
    valid.value = validateColor(trimColor);
    text.value = trimColor;
  }

  return { isColor: valid.value, color: text.value };
}
