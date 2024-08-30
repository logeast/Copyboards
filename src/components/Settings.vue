<template>
  <div class="settings p-4 bg-white rounded shadow">
    <h2 class="text-2xl font-bold mb-4">Settings</h2>
    <div class="setting-item mb-4">
      <label for="historyLimit" class="block mb-2">History Limit:</label>
      <input
        id="historyLimit"
        v-model.number="clipboardStore.limit"
        type="number"
        min="1"
        @change="updateSettings"
        class="w-full p-2 border rounded"
      />
    </div>
    <div class="setting-item mb-4">
      <label class="flex items-center">
        <input
          v-model="clipboardStore.showImages"
          type="checkbox"
          @change="updateSettings"
          class="mr-2"
        />
        <span>Show Images</span>
      </label>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useClipboardStore } from "../store/clipboard";

const clipboardStore = useClipboardStore();

const updateSettings = () => {
  clipboardStore.fetchHistory();
  // Add logic here to save settings to local storage
  localStorage.setItem(
    "clipboardSettings",
    JSON.stringify({
      limit: clipboardStore.limit,
      showImages: clipboardStore.showImages,
    })
  );
};
</script>
