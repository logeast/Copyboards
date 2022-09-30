let id = 0;

function generateId() {
  return ++id;
}

/**
 * Create a zero based auto incrementing id.
 *
 * @see https://github.com/tailwindlabs/headlessui/blob/main/packages/%40headlessui-vue/src/hooks/use-id.ts
 */
export function useId() {
  return generateId();
}
