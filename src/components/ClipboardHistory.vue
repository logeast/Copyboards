<template>
  <div>
    <h2>剪贴板历史</h2>
    <input v-model="clipboardStore.searchQuery" @input="clipboardStore.searchClipboard" placeholder="搜索剪贴板历史...">
    <ul>
      <ClipboardItem 
        v-for="item in clipboardStore.filteredHistory" 
        :key="item.id" 
        :item="item"
        @copy="copyToClipboard"
      />
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useClipboardStore } from '../store/clipboard';
import ClipboardItem from './ClipboardItem.vue';

const clipboardStore = useClipboardStore();

onMounted(async () => {
  await clipboardStore.fetchHistory();
});

const copyToClipboard = async (content: string | { Image: string }) => {
  await clipboardStore.addToClipboard(content);
};
</script>