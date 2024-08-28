import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { invoke } from '@tauri-apps/api/tauri'

export interface ClipboardItem {
  id: number;
  content: string;
  timestamp: string;
  category?: string;
}

export const useClipboardStore = defineStore('clipboard', () => {
  const history = ref<ClipboardItem[]>([]);
  const searchQuery = ref('');
  const limit = ref(50);

  const filteredHistory = computed(() => {
    if (!searchQuery.value) return history.value;
    return history.value.filter(item => 
      item.content.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });

  async function fetchHistory() {
    try {
      history.value = await invoke('get_clipboard_history', { limit: limit.value });
    } catch (error) {
      console.error('Failed to fetch clipboard history:', error);
    }
  }

  async function addToClipboard(content: string, category?: string) {
    try {
      await invoke('add_to_clipboard', { content, category });
      await fetchHistory(); // Refetch the history after adding a new item
    } catch (error) {
      console.error('Failed to add item to clipboard:', error);
    }
  }

  async function searchClipboard() {
    try {
      history.value = await invoke('search_clipboard', { query: searchQuery.value, limit: limit.value });
    } catch (error) {
      console.error('Failed to search clipboard:', error);
    }
  }

  return { history, searchQuery, limit, filteredHistory, fetchHistory, addToClipboard, searchClipboard }
})