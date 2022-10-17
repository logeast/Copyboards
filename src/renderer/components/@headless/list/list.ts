import {
  computed,
  ComputedRef,
  defineComponent,
  h,
  provide,
  ref,
  UnwrapNestedRefs,
} from "vue";
import { ListContext, ListOptionData, StateDefinition } from "./type";
import { useControllable } from "/@/hooks/use-controllable";
import { omit } from "../utils/render";

function defaultComparator<T>(a: T, z: T): boolean {
  return a === z;
}

/**
 * The main list component.
 */
export const List = defineComponent({
  name: "List",
  emits: { "update:modelValue": (_value: any) => true },
  inheritAttrs: false,
  props: {
    /**
     * The element or component the `List` should render as.
     */
    as: { type: [Object, String], default: "template" },

    /**
     * Use this to compare objects by a particular field.
     * Or pass your own comparison function for cumplete control over how objects are compared.
     */
    by: {
      type: [String, Function],
      default: () => defaultComparator,
    },
    /**
     * The selected value, the `List` supports `update:modelValue` emit.
     * Usually use `v-model` to get and set the value.
     */
    modelValue: { type: [Object, String, Number, Boolean], default: undefined },
    /**
     * The default value when using as an uncontrolled component.
     */
    defaultValue: {
      type: [Object, String, Number, Boolean],
      default: undefined,
    },
  },
  setup(props, { slots, emit }) {
    const optionsRef = ref<StateDefinition["optionsRef"]["value"]>(null);
    const options = ref<StateDefinition["options"]["value"]>([]);
    const selectedOptionIndex =
      ref<StateDefinition["selectedOptionIndex"]["value"]>(null);

    const [value, theirOnChange] = useControllable(
      computed(() => props.modelValue),
      (value: unknown) => emit("update:modelValue", value),
      computed(() => props.defaultValue)
    );

    function compare(a: any, z: any) {
      if (typeof props.by === "string") {
        const property = props.by;
        return a?.[property] === z?.[property];
      } else {
        return props.by(a, z);
      }
    }

    /**
     * https://github.com/tailwindlabs/headlessui/blob/main/packages/%40headlessui-vue/src/components/listbox/listbox.ts#L140
     */
    function adjustOrderedState(
      adjustment: (
        options: UnwrapNestedRefs<StateDefinition["options"]["value"]>
      ) => UnwrapNestedRefs<StateDefinition["options"]["value"]> = (i) => i
    ) {
      const currentSelectedOption =
        selectedOptionIndex.value !== null
          ? options.value[selectedOptionIndex.value]
          : null;
      const sortedOptions = adjustment(options.value.slice());

      let adjustedSelectedOptionIndex = currentSelectedOption
        ? sortedOptions.indexOf(currentSelectedOption)
        : null;

      if (adjustedSelectedOptionIndex === -1) {
        adjustedSelectedOptionIndex = null;
      }

      return {
        options: sortedOptions,
        selectedOptionIndex: adjustedSelectedOptionIndex,
      };
    }

    function goToOption(id: string) {
      console.log("options.value", options.value);
      const adjustedState = adjustOrderedState();

      const nextSelectedOptionIndex = options.value.findIndex((item) => {
        return item.id === id;
      });
      selectedOptionIndex.value = nextSelectedOptionIndex;
      options.value = adjustedState.options;
    }

    function registerOption(id: string, dataRef: ComputedRef<ListOptionData>) {
      const adjustedState = adjustOrderedState((options) => {
        return [...options, { id, dataRef }];
      });
      options.value = adjustedState.options;
      selectedOptionIndex.value = adjustedState.selectedOptionIndex;
    }

    function select(value: unknown) {
      theirOnChange(value);
    }

    const api = {
      value,
      optionsRef,
      options,
      selectedOptionIndex,
      compare,
      goToOption,
      registerOption,
      select,
    };

    provide(ListContext, api);

    return () => {
      const { as } = props;

      /**
       * The slot props.
       */
      const slot = { value: value.value };

      const ourProps = {};

      const theirProps = omit(props, ["defaultValue"]);

      const children = slots.default?.(slot);
      return h(as, Object.assign({}, ourProps, theirProps), children);
    };
  },
});
