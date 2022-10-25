import { defineComponent, h } from "vue";

/**
 * The component that directly wraps the list of options in your custom List.
 */
export const ListOptions = defineComponent({
  name: "ListOptions",
  props: {
    as: { type: [Object, String], default: "ul" },
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
