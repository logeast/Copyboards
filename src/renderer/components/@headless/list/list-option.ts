import { defineComponent, h, ref } from "vue";

/**
 * Used to wrap each item within your List.
 */
export const ListOption = defineComponent({
  name: "ListOption",
  props: {
    /**
     * The element or component the `ListOption` should render as.
     */
    as: { type: [Object, String], default: "li" },
    /**
     * The option value.
     */
    value: { type: [Object, String, Number, Boolean] },
  },
  setup(props, { slots, expose }) {
    return () => {
      /**
       * Exporse the internal option ref.
       */
      const internalOptionRef = ref<HTMLDivElement | null>(null);
      expose({ el: internalOptionRef, $el: internalOptionRef });

      const { as, ...incomingProps } = props;

      /**
       * The slot props.
       */
      const slot = {
        /**
         * whether or not the option is the selected option.
         */
        selected: false, // TODO: Pass in the real value.
      };

      const children = slots.default?.(slot);

      return h(as, Object.assign({}, incomingProps), children);
    };
  },
});
