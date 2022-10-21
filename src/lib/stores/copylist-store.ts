import { defineStore } from "pinia";

import { ListboxItemProps } from "/@/components/share-types";

export const useCopylistStore = defineStore("pannel-store", {
  state: () => ({
    datalist: [] as ListboxItemProps[],
    selectedItem: {} as ListboxItemProps,
  }),
  actions: {
    increment() {},
  },
});
