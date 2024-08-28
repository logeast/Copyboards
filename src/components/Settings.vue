<template>
  <div class="settings">
    <h2>设置</h2>
    <div class="setting-item">
      <label for="historyLimit">历史记录限制:</label>
      <input id="historyLimit" v-model.number="clipboardStore.limit" type="number" min="1" @change="updateSettings">
    </div>
    <div class="setting-item">
      <label for="showImages">显示图片:</label>
      <input id="showImages" v-model="clipboardStore.showImages" type="checkbox" @change="updateSettings">
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useClipboardStore } from '../store/clipboard';

const clipboardStore = useClipboardStore();

const updateSettings = () => {
  clipboardStore.fetchHistory();
  // 这里可以添加保存设置到本地存储的逻辑
};
</script>

<style scoped>
.settings {
  margin-top: 20px;
}

.setting-item {
  margin-bottom: 10px;
}

label {
  margin-right: 10px;
}
</style>