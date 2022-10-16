import { defineStore } from "pinia";

export const usePannelStore = defineStore("pannel-store", {
  state: () => {
    return {
      data: [],
    };
  },
  actions: {
    increment() {},
  },
});
