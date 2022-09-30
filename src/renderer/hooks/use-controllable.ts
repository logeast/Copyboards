import { computed, ComputedRef, UnwrapRef, ref } from "vue";

/**
 * Manage controlled and uncontrolled values.
 *
 * @see https://github.com/tailwindlabs/headlessui/blob/main/packages/%40headlessui-vue/src/hooks/use-controllable.ts
 *
 * @param controlledValue
 * @param onChange
 * @param defaultValue
 * @returns
 */
export function useControllable<T>(
  controlledValue: ComputedRef<T | undefined>,
  onChange?: (value: T) => void,
  defaultValue?: ComputedRef<T>
) {
  const internalValue = ref(defaultValue?.value);
  const isControlled = computed(() => controlledValue.value !== undefined);

  return [
    computed(() =>
      isControlled.value ? controlledValue.value : internalValue.value
    ),
    function (value: unknown) {
      if (isControlled.value) {
        return onChange?.(value as T);
      } else {
        internalValue.value = value as UnwrapRef<T>;
        return onChange?.(value as T);
      }
    },
  ] as const;
}
