import { computed, defineComponent, onMounted, ref } from "vue";
import { useListboxContext, ListboxOptionData } from "./type";
import { useId } from "/@/hooks/use-id";
import { dom } from "/@/utils/dom";
import { omit, render } from "/@/utils/render";

/**
 * Used to wrap each item within your Listbox.
 */
export const ListBoxOption = defineComponent({
  name: "ListBoxOption",
  props: {
    as: { type: [Object, String], default: "li" },
    value: { type: [Object, String, Number, Boolean] },
  },
  setup(props, { slots, attrs, expose }) {
    /**
     * Get global api from listbox.
     */
    const api = useListboxContext("ListBoxOption");

    const id = `headless-listbox-option-${useId()}`;

    /**
     * Define internal optionRef and expose public properties (Function).
     */
    const internalOptionRef = ref<HTMLElement | null>(null);
    expose({ el: internalOptionRef, $el: internalOptionRef });

    /**
     * Compute if the listbox option is selected.
     */
    const selected = computed(() => {
      console.log("api", api);

      return false;
      // api.activeOptionIndex.value
      //   ? api.options.value[api.activeOptionIndex.value].id === id
      //   : false;
    });

    /**
     * Define data of the listbox option.
     */
    const dataRef = computed<ListboxOptionData>(() => ({
      value: props.value,
      textValue: "",
      domRef: internalOptionRef,
    }));

    onMounted(() => {
      /**
       * Get textValue from domRef.
       * TODO: why should transform text to lower case?
       */
      const textValue = dom(internalOptionRef)
        ?.textContent?.toLowerCase()
        .trim();

      if (textValue !== undefined) {
        dataRef.value.textValue = textValue;
      }
    });

    function handleClick() {
      api.select(props.value);
    }

    function handleFocus() {}

    function handleMove() {}

    function handleLeave() {}

    return () => {
      const slot = { selected: selected.value };

      const ourPorps = {
        id,
        ref: internalOptionRef,
        role: "option",
        "aria-selected": selected.value,
        onClick: handleClick,
        onFocus: handleFocus,
        onMousemove: handleMove,
        onMouseleave: handleLeave,
      };

      return render({
        ourPorps,
        theirProps: omit(props, ["value"]),
        slots,
        slot,
        name: "ListBoxOption",
      });
    };
  },
});
