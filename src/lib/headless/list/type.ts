import { Ref, ComputedRef, inject, InjectionKey } from "vue";

/**
 * Define list option data's types.
 */
export type IListOptionData = {
  textValue: string;
  value: unknown;
  domRef: Ref<HTMLElement | null>;
};

/**
 * Define list component's global api.
 */
export type IStateDefinition = {
  /**
   * The reactive value of current selected option.
   */
  value: ComputedRef<unknown>;

  /**
   * Compare two values for equality.
   */
  compare: (a: any, z: any) => boolean;

  /**
   * expose options component's ref.
   */
  optionsRef: Ref<HTMLDivElement | null>;

  /**
   * List options with id and datas.
   */
  options: Ref<{ id: string; dataRef: ComputedRef<IListOptionData> }[]>;

  /**
   * Current selected option index.
   */
  selectedOptionIndex: Ref<number | null>;

  // state mutators
  // goToOption(focus: any, id?: string, trigger?: any): void;
  /**
   * Go to specific option.
   * @param id - option id
   */
  goToOption(id: string): void;

  /**
   * Register option's id and data.
   */
  registerOption(id: string, dataRef: ComputedRef<IListOptionData>): void;

  /**
   * Select the specific value.
   * @param value
   */
  select(value: unknown): void;
};

/**
 * Define the unique list context for provide function.
 * @see https://vuejs.org/guide/components/provide-inject.html
 */
export const ListContext = Symbol(
  "ListContext",
) as InjectionKey<IStateDefinition>;

/**
 * Inject the list context in the descendent compoents.
 * @param component - component name
 * @returns - context
 */
export function useListContext(component: string) {
  const context = inject(ListContext, null);

  if (context === null) {
    const err = new Error(
      `<${component} /> is missing a parent <List /> component.`,
    );
    throw err;
  }
  return context;
}
