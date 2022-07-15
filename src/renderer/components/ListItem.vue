<script setup lang="ts">
import { } from 'vue';

export interface ListItemProps {
  id: string | number;
  icon?: HTMLElement;
  text?: string;
  active?: boolean;
  date?: Date;
}

withDefaults(defineProps<ListItemProps>(), {
});

</script>

<template>
  <li class="flex items-center justify-between px-2 gap-2 h-9 rounded-lg cursor-pointer"
    :class="{ 'text-white bg-blue-500': active }">
    <div class="flex items-center justify-center w-4 h-4 flex-none">

    </div>
    <div class="flex-1 truncate" :title="text">{{ text }}</div>
  </li>
</template>
