<template>
  <li
    class="clipboard-item p-2 bg-white rounded shadow hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out"
    @click="copyToClipboard"
  >
    <div class="content">
      <template v-if="isText">
        {{ truncatedContent }}
      </template>
      <template v-else-if="isImage && clipboardStore.showImages">
        <img
          :src="imageSource"
          alt="Clipboard image"
          class="clipboard-image max-w-full h-auto"
        />
      </template>
      <template v-else-if="isImage && !clipboardStore.showImages">
        [Image]
      </template>
      <template v-else> Unknown content type </template>
    </div>
    <div class="metadata text-sm text-gray-500 mt-1">
      <span class="timestamp">{{ formattedTimestamp }}</span>
      <span
        v-if="item.category"
        class="category ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
        >{{ item.category }}</span
      >
    </div>
  </li>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useClipboardStore, type ClipboardItem } from "../store/clipboard";

const props = defineProps<{
  item: ClipboardItem;
}>();

const emit = defineEmits<{
  (e: "copy", content: string | { Image: string }): void;
}>();

const clipboardStore = useClipboardStore();

const isText = computed(() => "Text" in props.item.content);
const isImage = computed(() => "Image" in props.item.content);

const truncatedContent = computed(() => {
  if (isText.value && props.item.content.Text) {
    return props.item.content.Text.length > 50
      ? props.item.content.Text.slice(0, 50) + "..."
      : props.item.content.Text;
  }
  return "";
});

const imageSource = computed(() => {
  if (isImage.value && props.item.content.Image) {
    return `data:image/png;base64,${props.item.content.Image}`;
  }
  return "";
});

const formattedTimestamp = computed(() => {
  return new Date(props.item.timestamp).toLocaleString();
});

const copyToClipboard = () => {
  emit("copy", props.item.content);
};
</script>
