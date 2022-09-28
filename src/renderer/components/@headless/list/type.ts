import { Ref, ComputedRef, inject, InjectionKey } from "vue";

/**
 * Define list option data's types.
 */
export type ListOptionData = {
  textValue: string;
  value: unknown;
  domRef: Ref<HTMLElement | null>;
};

/**
 * Define list component's global api.
 */
export type StateDefinition = {
  value: ComputedRef<unknown>;

  compare: (a: unknown, z: unknown) => boolean;

  optionsRef: Ref<HTMLDivElement | null>;

  options: Ref<{ id: string; dataRef: ComputedRef<ListOptionData> }[]>;
  activeOptionIndex: Ref<number | null>;

  // state mutators
  goToOption(focus: any, id?: string, trigger?: any): void;
  select(value: unknown): void;
};

/**
 * Define the unique list context for provide function.
 * @see https://vuejs.org/guide/components/provide-inject.html
 */
export const ListContext = Symbol(
  "ListContext"
) as InjectionKey<StateDefinition>;

/**
 * Inject the list context in the descendent compoents.
 * @param component - component name
 * @returns - context
 */
export function useListContext(component: string) {
  const context = inject(ListContext, null);

  if (context === null) {
    const err = new Error(
      `<${component} /> is missing a parent <List /> component.`
    );
    throw err;
  }
  return context;
}
