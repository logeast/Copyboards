<script setup lang="ts">
const props = defineProps({
    value: Object,
})
</script>

<template>
    <li class="px-2 py-2 border-b">{{ value.text }}</li>
</template>