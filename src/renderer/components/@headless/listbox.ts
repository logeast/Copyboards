import { defineComponent, ref } from "vue";

/**
 * The main listbox component.
 */
export const Listbox = defineComponent({
  name: "Listbox",
  emits: { "update:modelValue": (_value: any) => true },
  props: {
    as: { type: [Object, String], default: "template" },
    modelValue: { type: [Object, String, Number, Boolean], default: undefined },
    defaultValue: {
      type: [Object, String, Number, Boolean],
      default: undefined,
    },
  },
  inheritAttrs: false,
  setup(props, { slots, attrs, emit }) {
    const options = ref([]);
  },
});

/**
 * The component that directly wraps the list of options in your custom Listbox.
 */
export const ListBoxOptions = defineComponent({
  name: "ListBoxOptions",
  props: {
    as: { type: [Object, String], default: "ul" },
  },
});

export const ListBoxOption = defineComponent({
  name: "ListBoxOption",
});
