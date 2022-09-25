import { computed, defineComponent, onMounted, ref } from "vue";
import { useListboxContext, ListboxOptionData } from "./type";
import { useId } from "/@/hooks/use-id";
import { dom } from "/@/utils/dom";
import { render } from "/@/utils/render";

/**
 * Used to wrap each item within your Listbox.
 */
export const ListBoxOption = defineComponent({
  name: "ListBoxOption",
  props: {
    as: { type: [Object, String], default: "li" },
    value: { type: [Object, String, Number, Boolean] },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs, expose }) {
    const api = useListboxContext("ListBoxOption");
    const id = `headless-listbox-option-${useId()}`;
    const internalOptionRef = ref<HTMLElement | null>(null);

    expose({ el: internalOptionRef, $el: internalOptionRef });

    const selected = computed(() => {
      console.log("api", api);

      return false;
      // api.activeOptionIndex.value
      //   ? api.options.value[api.activeOptionIndex.value].id === id
      //   : false;
    });

    /** Define data of the listbox option */
    const dataRef = computed<ListboxOptionData>(() => ({
      disabled: props.disabled,
      value: props.value,
      textValue: "",
      domRef: internalOptionRef,
    }));

    onMounted(() => {
      /** get textValue from domRef */
      const textValue = dom(internalOptionRef)
        ?.textContent?.toLowerCase()
        .trim();
      if (textValue !== undefined) {
        dataRef.value.textValue = textValue;
      }
    });

    return () => {
      const { disabled } = props;

      const slot = { selected: selected.value, disabled };

      const ourPorps = {
        id,
        ref: internalOptionRef,
        role: "option",
        tabIndex: disabled === true ? undefined : -1,
        "aria-disabled": disabled === true ? true : undefined,
      };

      return render({
        theirProps: props,
        ourPorps,
        slots,
        slot,
        name: "ListBoxOption",
      });
    };
  },
});
