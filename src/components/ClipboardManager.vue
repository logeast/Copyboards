<template>
  <main
    class="flex flex-col h-screen overflow-hidden bg-transparent text-gray-900"
  >
    <section class="flex-none border-b border-gray-100 sticky z-10 py-1.5">
      <IconSearch class="absolute left-4 top-0 bottom-0 m-auto" />
      <input
        v-model="searchQuery"
        @input="searchClipboard"
        placeholder="Copyboards Search"
        class="w-full bg-transparent text-lg placeholder:text-gray-400 h-9 pl-12 border-none outline-none"
      />
    </section>

    <section class="flex flex-1 overflow-y-auto">
      <div class="w-1/2 px-2 py-2 overflow-y-auto" @scroll="handleScroll">
        <ul>
          <li
            v-for="(item, index) in clipboardStore.filteredHistory"
            :key="item.id"
            @click="copyToClipboard(item.content)"
            @mouseover="setActiveItem(item)"
            @keydown.enter="copyToClipboard(item.content)"
            @keydown.arrow-up.prevent="navigateItems('up')"
            @keydown.arrow-down.prevent="navigateItems('down')"
            class="cursor-pointer px-2 rounded-lg text-sm h-9 flex justify-between gap-2 items-center relative"
            :class="{
              'bg-indigo-500 text-white': activeItem === item,
            }"
            tabindex="0"
          >
            <div class="text-ellipsis overflow-hidden whitespace-nowrap">
              {{ truncateContent(item.content) }}
            </div>
            <span
              class="text-indigo-500"
              :class="{
                '!text-white': activeItem === item,
              }"
              v-if="index < 9"
            >
              ⌘{{ index + 1 }}
            </span>
          </li>
        </ul>
      </div>

      <div class="w-1/2 p-4 bg-gray-50">
        <div v-if="activeItem" class="bg-white p-4 rounded shadow">
          <h3 class="text-xl font-semibold mb-2">Selected Item</h3>
          <pre class="bg-gray-100 p-2 rounded whitespace-pre-wrap">{{
            activeItem.content.Text || activeItem.content.Image
          }}</pre>
          <div class="mt-4">
            <button
              @click="copyToClipboard(activeItem.content)"
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
    </section>
  </main>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useClipboardStore, type ClipboardItem } from "../store/clipboard";
import IconSearch from "./IconSearch.vue";

const clipboardStore = useClipboardStore();
const activeItem = ref<ClipboardItem | null>(null);
const searchQuery = ref("");
const currentScrollIndex = ref(0);

const setActiveItem = (item: ClipboardItem) => {
  activeItem.value = item;
};

const truncateContent = (content: any) => {
  if (content.Text) {
    return content.Text;
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

const handleShortcut = (event: KeyboardEvent) => {
  const key = event.key;
  if (key >= "1" && key <= "9") {
    event.preventDefault();
    const index = parseInt(key) - 1;
    const item =
      clipboardStore.filteredHistory[currentScrollIndex.value + index];
    if (item) {
      setActiveItem(item);
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
    (item) => item === activeItem.value
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

  setActiveItem(clipboardStore.filteredHistory[newIndex]);
};

const handleScroll = (event: Event) => {
  const element = event.target as HTMLElement;
  const scrollTop = element.scrollTop;
  const itemHeight = 36; // Assuming each item has a height of 36px
  currentScrollIndex.value = Math.floor(scrollTop / itemHeight);
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
    handleShortcut(event);
  }
};
</script>
