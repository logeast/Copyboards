import { defineComponent } from "vue";
import { useListboxContext } from "./type";
import { useId } from "/@/hooks/use-id";
import { render } from "/@/utils/render";

/**
 * The component that directly wraps the list of options in your custom Listbox.
 */
export const ListBoxOptions = defineComponent({
  name: "ListBoxOptions",
  props: {
    as: { type: [Object, String], default: "ul" },
  },
  setup(props, { attrs, slots, expose }) {
    const api = useListboxContext("ListboxOptions");

    const id = `headless-listbox-options-${useId()}`;

    expose({ el: api.optionsRef, $el: api.optionsRef });

    /** Listen to keyboards events */
    function handleKeyDown(event: KeyboardEvent) {}

    return () => {
      const slot = {};
      const ourPorps = {
        id,
        onkeydown: handleKeyDown,
        role: "listbox",
        tabIndex: 0,
        ref: api.optionsRef,
      };
      const theirProps = props;

      return render({
        theirProps,
        ourPorps,
        slots,
        slot,
        name: "listboxOptions",
      });
    };
  },
});
