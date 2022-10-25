<script setup lang="ts">
import Empty from "./Empty.vue";

defineProps({
  /** Whether show preview section or not. */
  preview: { type: Boolean, default: true },
  empty: { type: Boolean, default: false },
});
</script>

<template>
  <div class="h-96">
    <header class="sticky top-0 z-40">
      <slot name="header"></slot>
    </header>

    <main class="flex" v-if="!empty">
      <section class="flex-auto overflow-y-auto">
        <slot name="copylist"></slot>
      </section>

      <section v-if="preview" class="min-w-[50%] overflow-y-auto">
        <slot name="preview"></slot>
      </section>
    </main>

    <main v-else>
      <Empty></Empty>
    </main>
  </div>
</template>
