<template>
  <li class="clipboard-item" @click="copyToClipboard">
    <div class="content">
      <template v-if="isText">
        {{ truncatedContent }}
      </template>
      <template v-else-if="isImage">
        <img :src="imageSource" alt="Clipboard image" class="clipboard-image" />
      </template>
      <template v-else>
        Unknown content type
      </template>
    </div>
    <div class="metadata">
      <span class="timestamp">{{ formattedTimestamp }}</span>
      <span v-if="item.category" class="category">{{ item.category }}</span>
    </div>
  </li>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { ClipboardItem } from '../store/clipboard';

const props = defineProps<{
  item: ClipboardItem
}>();

const emit = defineEmits<{
  (e: 'copy', content: string | { Image: string }): void
}>();

const isText = computed(() => 'Text' in props.item.content);
const isImage = computed(() => 'Image' in props.item.content);

const truncatedContent = computed(() => {
  if (isText.value && props.item.content.Text) {
    return props.item.content.Text.length > 50 
      ? props.item.content.Text.slice(0, 50) + '...' 
      : props.item.content.Text;
  }
  return '';
});

const imageSource = computed(() => {
  if (isImage.value && props.item.content.Image) {
    return `data:image/png;base64,${props.item.content.Image}`;
  }
  return '';
});

const formattedTimestamp = computed(() => {
  return new Date(props.item.timestamp).toLocaleString();
});

const copyToClipboard = () => {
  emit('copy', props.item.content);
};
</script>

<style scoped>
.clipboard-image {
  max-width: 100px;
  max-height: 100px;
  object-fit: contain;
}
</style>