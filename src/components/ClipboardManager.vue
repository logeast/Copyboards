<template>
  <main
    class="flex flex-col h-screen overflow-hidden bg-gray-100 text-gray-900"
  >
    <section class="flex-none border-b border-gray-200 sticky z-10 py-1.5">
      <IconSearch class="absolute left-4 top-0 bottom-0 m-auto" />
      <input
        v-model="searchQuery"
        @input="searchClipboard"
        placeholder="Copyboards Search"
        class="w-full bg-transparent text-lg placeholder:text-gray-400 h-9 pl-12 border-none outline-none"
      />
    </section>

    <section class="flex flex-1 overflow-y-auto">
      <div class="w-1/2 px-3 py-2 overflow-y-auto" @scroll="handleScroll">
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
            <div
              class="flex items-center gap-2 text-ellipsis overflow-hidden whitespace-nowrap"
            >
              <span v-if="item.content.Text">📄</span>
              <span v-else-if="item.content.Image">🖼️</span>
              <span v-else-if="item.content.Color">🎨</span>
              <span v-else>❓</span>
              <div class="text-ellipsis overflow-hidden whitespace-nowrap">
                {{ getContentPreview(item.content) }}
              </div>
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

      <div class="w-1/2 py-4 bg-white">
        <div v-if="activeItem" class="flex flex-col h-full">
          <div class="px-3 flex-1 overflow-y-auto text-sm">
            <pre
              v-if="activeItem.content.Text"
              class="rounded whitespace-pre-wrap"
            >
              {{ activeItem.content.Text.text }}
            </pre>
            <img
              v-else-if="activeItem.content.Image"
              :src="activeItem.content.Image.path"
              class="w-[120px] h-[120px]"
            />
            <div
              v-else-if="activeItem.content.Color"
              class="flex flex-col gap-1"
            >
              <span>{{ activeItem.content.Color.color }}</span>
              <div
                class="w-full aspect-square rounded-md mr-2"
                :style="{ backgroundColor: activeItem.content.Color.color }"
              ></div>
            </div>
            <pre v-else class="rounded whitespace-pre-wrap">{{
              JSON.stringify(activeItem.content, null, 2)
            }}</pre>
          </div>
          <div
            class="flex-none flex flex-col gap-1 items-center justify-center text-xs text-gray-400 pt-2"
          >
            <span v-if="activeItem.content.Text">
              {{ activeItem.content.Text.word_count }} words;
              {{ activeItem.content.Text.character_count }} characters
            </span>
            <span>Copied at {{ dayjs(activeItem.created_at).fromNow() }}</span>
          </div>
        </div>
        <div v-else class="px-3 text-gray-500">
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
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const clipboardStore = useClipboardStore();
const activeItem = ref<ClipboardItem | null>(null);
const searchQuery = ref("");
const currentScrollIndex = ref(0);

const setActiveItem = (item: ClipboardItem) => {
  activeItem.value = item;
};

const getContentPreview = (content: any) => {
  if (content.Text) {
    return content.Text.text.trim();
  }
  if (content.Image) {
    return "[Image]";
  }
  if (content.Color) {
    return content.Color.color;
  }
  return "[Unknown]";
};

const copyToClipboard = async (content: any) => {
  try {
    if (content.Text) {
      await navigator.clipboard.writeText(content.Text.text);
    } else if (content.Image) {
      const response = await fetch(content.Image.path);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
    } else if (content.Color) {
      await navigator.clipboard.writeText(content.Color.color);
    } else {
      console.warn("Unsupported content type:", content);
      return;
    }
    console.log("Content copied to clipboard");
  } catch (error) {
    console.error("Failed to copy content:", error);
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
  await clipboardStore.setupClipboardListener();
  window.addEventListener("keydown", handleGlobalShortcut);

  if (clipboardStore.filteredHistory.length > 0) {
    setActiveItem(clipboardStore.filteredHistory[0]);
  }

  console.log("filteredHistory", clipboardStore.filteredHistory);
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
