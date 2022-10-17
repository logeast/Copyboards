import { defineStore } from "pinia";

import { ListboxItemProps } from "/@/components/share-types";

export const useListStore = defineStore("pannel-store", {
  state: () => ({
    datalist: [] as ListboxItemProps[],
    selectedItem: {} as ListboxItemProps,
  }),
  actions: {
    increment() {},
  },
});
