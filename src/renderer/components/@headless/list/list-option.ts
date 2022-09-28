import {
  computed,
  defineComponent,
  h,
  onMounted,
  ref,
  toRaw,
  watch,
} from "vue";
import { ListOptionData, useListContext } from "./type";
import { useId } from "/@/hooks/use-id";

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
    value: { type: [Object, String, Number, Boolean], default: 1 },
  },
  setup(props, { slots, expose }) {
    const api = useListContext("ListOption");

    const id = `headless-list-option-${useId()}`;

    console.log("api", api);

    /**
     * Exporse the internal option ref.
     */
    const internalOptionRef = ref<HTMLDivElement | null>(null);
    expose({ el: internalOptionRef, $el: internalOptionRef });

    const selected = computed(() =>
      api.compare(toRaw(api.value.value), toRaw(props.value))
    );

    const dataRef = computed<ListOptionData>(() => ({
      textValue: "",
      value: props.value,
      domRef: internalOptionRef,
    }));
    onMounted(() => api.registerOption(id, dataRef));

    onMounted(() => {
      watch([selected], () => {
        if (!selected.value) return;
        api.goToOption(id);
      });
    });

    function handleClick(e: MouseEvent) {
      console.log("e", e);

      api.select(props.value);
    }

    function handleMove(e: MouseEvent) {
      // api.goToOption(id);
      api.select(props.value);
    }

    return () => {
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

      const ourPorps = {
        id,
        ref: internalOptionRef,
        role: "option",
        onClick: handleClick,
        onMousemove: handleMove,
        onPointermove: handleMove,
      };

      const children = slots.default?.(slot);

      return h(as, Object.assign({}, incomingProps, ourPorps), children);
    };
  },
});
