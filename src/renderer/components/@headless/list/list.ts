import { defineComponent, h } from "vue";

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
