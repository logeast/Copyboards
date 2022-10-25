<script setup lang="ts">
defineProps({
  icon: { type: String, default: "../assets/empty-box.png" },
  text: { type: String, default: "It is empty here." },
});
</script>

<template>
  <section class="flex flex-col gap-1 items-center justify-center">
    <img :src="icon" class="w-48" alt="" />
    <p class="text-gray-400">{{ text }}</p>
  </section>
</template>
