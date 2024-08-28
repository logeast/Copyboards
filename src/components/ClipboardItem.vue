<template>
  <li class="clipboard-item" @click="copyToClipboard">
    <div class="content">{{ truncatedContent }}</div>
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
  (e: 'copy', content: string): void
}>();

const truncatedContent = computed(() => {
  return props.item.content.length > 50 ? props.item.content.slice(0, 50) + '...' : props.item.content;
});

const formattedTimestamp = computed(() => {
  return new Date(props.item.timestamp).toLocaleString();
});

const copyToClipboard = () => {
  emit('copy', props.item.content);
};
</script>