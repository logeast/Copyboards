import { defineStore } from "pinia";

import { ListboxItemProps } from "/@/components/share-types";

export const useListStore = defineStore("pannel-store", {
  state: () => ({
    data: [] as ListboxItemProps[],
  }),
  actions: {
    increment() {},
  },
});
