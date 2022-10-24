import { defineStore } from "pinia";
import { ref } from "vue";

import { IAPICopylistItem } from "../api";
import { CopylistDatabase } from "../databases";

export const useCopylistStore = defineStore("pannel-store", () => {
  /** Initial database */
  const db = new CopylistDatabase("CopylistDatabase");

  const emitQueeued = ref(false);

  const copylist = ref<IAPICopylistItem[]>([]);
  const selectedItem = ref<IAPICopylistItem>();

  /**
   * Add a new copylist item into coyplist database.
   */
  async function addCopylistItem(
    apiCopylistItem: IAPICopylistItem
  ): Promise<IAPICopylistItem> {
    const item = await db.transaction("rw", db.copylistTable, async () => {
      const dbItem: IAPICopylistItem = { ...apiCopylistItem };
      const id = await db.copylistTable.add(dbItem);
      return { id, ...dbItem };
    });

    updatedCopylist();
    return item;
  }

  /**
   * Get al the local copylist items.
   */
  function getAll(): Promise<ReadonlyArray<IAPICopylistItem>> {
    return db.transaction("r", db.copylistTable, async () => {
      const result: IAPICopylistItem[] = [];

      for (const dbItem of await db.copylistTable.toArray()) {
        result.push(dbItem);
      }

      return result;
    });
  }

  /**
   * Find a copylist item by its content.
   */
  async function findCopylistItemByContent(content: string) {}

  /**
   * Insert or update the copylist database record.
   */
  function upsertCopylistItem(apiCopylistItem: IAPICopylistItem) {
    const _upsertCopylistItem = async (apiCopylistItem: IAPICopylistItem) => {};

    return db.transaction("rw", db.copylistTable, () =>
      _upsertCopylistItem(apiCopylistItem)
    );
  }

  function updatedCopylist() {
    if (!emitQueeued.value) {
      getAll()
        .then((data) => (copylist.value = [...data]))
        .catch((e) => console.error("Failed emitting update", e))
        .finally(() => (emitQueeued.value = false));
      emitQueeued.value = true;
    }
  }

  return {
    copylist,
    selectedItem,

    addCopylistItem,
    getAll,
    findCopylistItemByContent,
    upsertCopylistItem,
  };
});
