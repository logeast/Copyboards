<script setup lang="ts">
defineProps<{ msg: string }>();
</script>

<template>
  <h1 class="text-green-500">{{ msg }}</h1>
</template>
