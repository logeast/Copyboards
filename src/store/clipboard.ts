import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { invoke } from "@tauri-apps/api/tauri";
import { listen, UnlistenFn } from "@tauri-apps/api/event";

export interface ClipboardItem {
  id: number;
  content: {
    Text?: string;
    Image?: string;
    Unknown?: null;
  };
  timestamp: string;
  category?: string;
}

export const useClipboardStore = defineStore("clipboard", () => {
  const history = ref<ClipboardItem[]>([]);
  const searchQuery = ref("");
  const limit = ref(50);
  const showImages = ref(true);

  const filteredHistory = computed(() => {
    if (!searchQuery.value) return history.value;
    return history.value.filter((item) => {
      if (item.content.Text) {
        return item.content.Text.toLowerCase().includes(
          searchQuery.value.toLowerCase()
        );
      }
      return false;
    });
  });

  async function fetchHistory() {
    try {
      history.value = await invoke("get_clipboard_history", {
        limit: limit.value,
      });
    } catch (error) {
      console.error("Failed to fetch clipboard history:", error);
    }
  }

  async function addToClipboard(
    content: string | { Image: string },
    category?: string
  ) {
    try {
      await invoke("add_to_clipboard", {
        content: typeof content === "string" ? { Text: content } : content,
        category,
      });
      await fetchHistory();
    } catch (error) {
      console.error("Failed to add to clipboard:", error);
    }
  }

  async function searchClipboard() {
    try {
      history.value = await invoke("search_clipboard", {
        query: searchQuery.value,
        limit: limit.value,
      });
    } catch (error) {
      console.error("Failed to search clipboard:", error);
    }
  }

  let unlistenFn: UnlistenFn | null = null;

  async function setupClipboardListener() {
    unlistenFn = await listen("clipboard-changed", (event: any) => {
      console.log("Clipboard content changed:", event.payload);
      fetchHistory();
    });
  }

  function cleanup() {
    if (unlistenFn) {
      unlistenFn();
    }
  }

  return {
    history,
    searchQuery,
    limit,
    showImages,
    filteredHistory,
    fetchHistory,
    addToClipboard,
    searchClipboard,
    setupClipboardListener,
    cleanup,
  };
});
