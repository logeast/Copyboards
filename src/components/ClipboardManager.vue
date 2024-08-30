<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Left side: Preview list -->
    <div class="w-1/3 p-4 overflow-y-auto bg-white shadow-md">
      <h2 class="text-2xl font-bold mb-4">All Snippets</h2>
      <input
        v-model="searchQuery"
        @input="searchClipboard"
        placeholder="Search snippets..."
        class="w-full p-2 mb-4 border rounded"
      />
      <ul>
        <li
          v-for="(item, index) in clipboardStore.filteredHistory"
          :key="item.id"
          @click="selectItem(item)"
          @mouseover="hoverItem = item"
          @mouseleave="hoverItem = null"
          @keydown.enter="copyToClipboard(item.content)"
          @keydown.arrow-up.prevent="navigateItems('up')"
          @keydown.arrow-down.prevent="navigateItems('down')"
          class="cursor-pointer hover:bg-gray-100 p-2 rounded"
          :class="{
            'bg-blue-100': selectedItem === item,
            'bg-yellow-100': hoverItem === item,
          }"
          tabindex="0"
        >
          <div class="flex items-center">
            <span class="text-gray-500 mr-2">⌘{{ index + 1 }}</span>
            <span>{{ truncateContent(item.content) }}</span>
          </div>
        </li>
      </ul>
    </div>

    <!-- Right side: Item details -->
    <div class="w-2/3 p-4 bg-gray-50">
      <div v-if="selectedItem" class="bg-white p-4 rounded shadow">
        <h3 class="text-xl font-semibold mb-2">Selected Item</h3>
        <pre class="bg-gray-100 p-2 rounded whitespace-pre-wrap">{{
          selectedItem.content.Text || selectedItem.content.Image
        }}</pre>
        <div class="mt-4">
          <button
            @click="copyToClipboard(selectedItem.content)"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Copy to Clipboard
          </button>
        </div>
      </div>
      <div v-else class="text-gray-500">
        Select an item from the list to view details
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useClipboardStore, type ClipboardItem } from "../store/clipboard";

const clipboardStore = useClipboardStore();
const selectedItem = ref<ClipboardItem | null>(null);
const hoverItem = ref<ClipboardItem | null>(null);
const searchQuery = ref("");

const selectItem = (item: ClipboardItem) => {
  selectedItem.value = item;
};

const truncateContent = (content: any) => {
  if (content.Text) {
    return content.Text.length > 30
      ? content.Text.slice(0, 30) + "..."
      : content.Text;
  }
  return content.Image ? "[Image]" : "[Unknown]";
};

const copyToClipboard = async (content: any) => {
  if (content.Text) {
    await navigator.clipboard.writeText(content.Text);
  } else if (content.Image) {
    await navigator.clipboard.writeText(content.Image);
  }
};

const handleShortcut = (event: KeyboardEvent, index: number) => {
  const key = event.key;
  if (key >= "1" && key <= "9") {
    event.preventDefault();
    const item = clipboardStore.filteredHistory[index];
    if (item) {
      selectItem(item);
      copyToClipboard(item.content);
    }
  }
};

const searchClipboard = () => {
  clipboardStore.searchQuery = searchQuery.value;
  clipboardStore.searchClipboard();
};

const navigateItems = (direction: "up" | "down") => {
  const currentIndex = clipboardStore.filteredHistory.findIndex(
    (item) => item === selectedItem.value
  );
  let newIndex;

  if (direction === "up") {
    newIndex =
      currentIndex > 0
        ? currentIndex - 1
        : clipboardStore.filteredHistory.length - 1;
  } else {
    newIndex =
      currentIndex < clipboardStore.filteredHistory.length - 1
        ? currentIndex + 1
        : 0;
  }

  selectItem(clipboardStore.filteredHistory[newIndex]);
};

onMounted(async () => {
  await clipboardStore.fetchHistory();
  window.addEventListener("keydown", handleGlobalShortcut);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleGlobalShortcut);
});

const handleGlobalShortcut = (event: KeyboardEvent) => {
  if (event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey) {
    handleShortcut(event, parseInt(event.key) - 1);
  }
};
</script>
