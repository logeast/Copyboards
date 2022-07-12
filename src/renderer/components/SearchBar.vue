<script setup lang="ts">
import { InputHTMLAttributes } from 'vue';

interface Props {
  placeholder?: InputHTMLAttributes['placeholder'];
}

withDefaults(defineProps<Props>(), {
  placeholder: 'Copyboards Search',
});
</script>

<template>
  <section class="flex items-center justify-between border-b px-2 gap-2 border-gray-300 rounded-t-2xl"
    style="height: 56px;">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
      stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input class="flex-1 h-full outline-none" autofocus :placeholder="placeholder">
    <div class="flex items-center justify-center w-6">
      <slot></slot>
    </div>
  </section>
</template>
