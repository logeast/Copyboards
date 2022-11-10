<script setup lang="ts">
import { defineProps } from "vue";
import Empty from "./Empty.vue";

defineProps({
  /** Whether show preview section or not. */
  preview: { type: Boolean, default: true },
  empty: { type: Boolean, default: false },
});
</script>

<template>
  <div class="flex flex-col h-screen">
    <header class="sticky top-0 z-40">
      <slot name="header" />
    </header>

    <main v-if="!empty" class="flex flex-1 overflow-hidden">
      <section class="flex-auto overflow-y-auto p-2">
        <slot name="copylist" />
      </section>

      <section v-if="preview" class="min-w-[50%] overflow-y-auto">
        <slot name="preview" />
      </section>
    </main>

    <main v-else>
      <Empty />
    </main>
  </div>
</template>
