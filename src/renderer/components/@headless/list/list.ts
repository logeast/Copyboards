import { defineComponent, h, provide, ref } from "vue";
import { ListContext, StateDefinition } from "./type";

/**
 * The main list component.
 */
export const List = defineComponent({
  name: "List",
  emits: { "update:modelValue": (_value: any) => true },
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
      default: <T>(a: T, z: T) => a === z,
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
  setup(props, { slots }) {
    const optionsRef = ref<StateDefinition["optionsRef"]["value"]>(null);
    const options = ref<StateDefinition["options"]["value"]>([]);
    const selectedOptionIndex =
      ref<StateDefinition["selectedOptionIndex"]["value"]>(null);

    // TOOD: Compose controlled value and default value.
    const value = ref(props.defaultValue);

    function compare(a: any, z: any) {
      if (typeof props.by === "string") {
        const property = props.by;
        return a?.[property] === z?.[property];
      }
      return props.by(a, z);
    }

    function goToOption(id?: string) {
      const nextSelectedOptionIndex = 0; // TODO: calcluateActiveIndex

      selectedOptionIndex.value = nextSelectedOptionIndex;
    }

    function select() {}

    const api = {
      value,
      optionsRef,
      options,
      selectedOptionIndex,
      compare,
      goToOption,
      select,
    };

    provide(ListContext, api);

    return () => {
      const { as, ...incomingProps } = props;

      /**
       * The slot props.
       */
      const slot = {};

      const children = slots.default?.(slot);
      return h(as, Object.assign({}, incomingProps), children);
    };
  },
});
