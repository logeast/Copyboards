import { defineStore } from "pinia";
import { ref, computed, onMounted, onUnmounted } from "vue";
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

  const filteredHistory = computed(() => {
    if (!searchQuery.value) return history.value;
    return history.value.filter((item) => {
      if (item.content.Text) {
        return item.content.Text.toLowerCase().includes(
          searchQuery.value.toLowerCase()
        );
      }
      return false; // Exclude image items from text search
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
      if (typeof content === "string") {
        await invoke("add_to_clipboard", {
          content: { Text: content },
          category,
        });
      } else {
        await invoke("add_to_clipboard", { content, category });
      }
      await fetchHistory(); // Refetch the history after adding a new item
    } catch (error) {
      console.error("Failed to add item to clipboard:", error);
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
      fetchHistory(); // 更新剪贴板历史
    });
  }

  // 在组件挂载时设置监听器
  onMounted(() => {
    setupClipboardListener();
  });

  // 在组件卸载时移除监听器
  onUnmounted(() => {
    if (unlistenFn) {
      unlistenFn();
    }
  });

  return {
    history,
    searchQuery,
    limit,
    filteredHistory,
    fetchHistory,
    addToClipboard,
    searchClipboard,
    setupClipboardListener,
  };
});
