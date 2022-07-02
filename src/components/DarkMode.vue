<script setup lang="ts">
import { ref } from 'vue';
const message = ref('System');

async function ToggleDarkMode() {
  console.log(await window.darkMode);
  const isDarkMode = await window.darkMode.toggle();
  message.value = isDarkMode ? 'Dark' : 'Light';
}

async function ResetToSystemTheme() {
  await window.darkMode.system();
  message.value = 'System';
}
</script>

<template>
  <div class="border-b py-4">
    <p>
      Current theme source: <strong>{{ message }}</strong>
    </p>
    <button
      class="px-2 py-1 rounded-md border bg-indigo-500 hover:bg-indigo-600 text-white mr-2"
      @click="ToggleDarkMode"
    >
      Toggle Dark Mode
    </button>
    <button class="px-2 py-1 rounded-md border" @click="ResetToSystemTheme">Reset to System Theme</button>
  </div>
</template>
