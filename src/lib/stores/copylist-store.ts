import { defineStore } from "pinia";

import { IAPICopylistItem } from "../api";

export const useCopylistStore = defineStore("pannel-store", {
  state: () => ({
    datalist: [] as IAPICopylistItem[],
    selectedItem: {} as IAPICopylistItem,
  }),
  actions: {
    increment() {},
  },
});
