import { Ref, ComputedRef, inject, InjectionKey } from "vue";

/**
 * Define listbox option data's types.
 */
export type ListboxOptionData = {
  textValue: string;
  disabled: boolean;
  value: unknown;
  domRef: Ref<HTMLElement | null>;
};

/**
 * Define Listbox component's global api.
 */
export type StateDefinition = {
  value: ComputedRef<unknown>;

  compare: (a: unknown, z: unknown) => boolean;

  optionsRef: Ref<HTMLDivElement | null>;

  disabled: Ref<boolean>;
  options: Ref<{ id: string; dataRef: ComputedRef<ListboxOptionData> }[]>;
  activeOptionIndex: Ref<number | null>;

  // state mutators
  goToOption(focus: any, id?: string, trigger?: any): void;
  select(value: unknown): void;
};

/**
 * Define the unique listbox content.
 */
export const ListboxContext = Symbol(
  "ListboxContext"
) as InjectionKey<StateDefinition>;

/**
 * Use listbox context.
 * @param component
 * @returns
 */
export function useListboxContext(component: string) {
  const context = inject(ListboxContext, null);

  if (context === null) {
    const err = new Error(
      `<${component} /> is missing a parent <Listbox /> component.`
    );
    throw err;
  }
  return context;
}
