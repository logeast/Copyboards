import {
  computed,
  defineComponent,
  Fragment,
  h,
  provide,
  ref,
  UnwrapNestedRefs,
} from "vue";
import { StateDefinition, ListboxContext } from "./type";
import { useControllable } from "/@/hooks/use-controllable";
import { calculateActiveIndex, Focus } from "/@/utils/calculate-active-index";
import { dom } from "/@/utils/dom";
import { sortByDomNode } from "/@/utils/focus-management";
import { render } from "/@/utils/render";

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
    name: { type: String, optional: true },
  },
  inheritAttrs: false,
  setup(props, { slots, attrs, emit }) {
    const optionsRef = ref<StateDefinition["optionsRef"]["value"]>(null);
    const options = ref<StateDefinition["options"]["value"]>([]);
    const activeOptionIndex =
      ref<StateDefinition["activeOptionIndex"]["value"]>(null);

    function adjusetOrderedState(
      adjustment: (
        options: UnwrapNestedRefs<StateDefinition["options"]["value"]>
      ) => UnwrapNestedRefs<StateDefinition["options"]["value"]> = (i) => i
    ) {
      const currentActiveOption =
        activeOptionIndex.value !== null
          ? options.value[activeOptionIndex.value]
          : null;

      const sortedOptions = sortByDomNode(
        adjustment(options.value.slice()),
        (option) => dom(option.dataRef.domRef)
      );

      let adjustedActiveOptionIndex = currentActiveOption
        ? sortedOptions.indexOf(currentActiveOption)
        : null;

      if (adjustedActiveOptionIndex === -1) {
        adjustedActiveOptionIndex = null;
      }

      return {
        options: sortedOptions,
        activeOptionIndex: adjustedActiveOptionIndex,
      };
    }

    const [value, theirOnChange] = useControllable(
      computed(() => props.modelValue),
      (value: unknown) => emit("update:modelValue", value),
      computed(() => props.defaultValue)
    );

    const ourPorps = {};

    function goToOption(focus: any, id?: string, trigger?: any) {
      const adjustedState = adjusetOrderedState();
      const nextActiveOptionIndex = calculateActiveIndex(
        focus === Focus.Specific
          ? { focus: Focus.Specific, id: id! }
          : { focus: focus as Exclude<Focus, Focus.Specific> },
        {
          resolveItems: () => adjustedState.options,
          resolveActiveIndex: () => adjustedState.activeOptionIndex,
          resolveId: (option) => option.id,
          resolveDisabled: () => false,
        }
      );

      activeOptionIndex.value = nextActiveOptionIndex;
      options.value = adjustedState.options;
    }

    function select(value: unknown) {
      theirOnChange(value);
    }

    const api = {
      value,
      optionsRef,
      options,
      goToOption,
      select,
    };

    provide(ListboxContext, api);

    return () => {
      const { name, modelValue, ...theirProps } = props;

      const slot = {};

      return h(Fragment, [
        [],
        render({
          ourPorps,
          theirProps,
          slots,
          slot,
          name: "Listbox",
        }),
      ]);
    };
  },
});
