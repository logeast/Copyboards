import { defineComponent, Fragment, h } from "vue";

/**
 * The main list component.
 */
export const List = defineComponent({
  name: "List",
  props: {
    as: { type: [Object, String], default: "template" },
    modelValue: { type: [Object, String, Number, Boolean], default: undefined },
    defaultValue: {
      type: [Object, String, Number, Boolean],
      default: undefined,
    },
  },
  setup(props, { slots, expose }) {
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
