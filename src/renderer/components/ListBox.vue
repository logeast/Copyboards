<script setup lang="ts">
import { List, ListOptions, ListOption } from "../../lib/headless/list";
import { useCopylistStore } from "../../lib/stores/copylist-store";

const copylistStore = useCopylistStore();

console.log("copylistStore.copylist", copylistStore.copylist);
</script>

<template>
  <div class="px-3 py-2">
    <List
      v-model="copylistStore.selectedItem"
      as="div"
    >
      <ListOptions>
        <ListOption
          v-for="item in copylistStore.copylist"
          v-slot="{ selected }"
          :key="item.id"
          :value="item"
        >
          <li
            :class="[
              { 'text-white bg-blue-500': selected },
              'flex items-center justify-between px-2 gap-2 h-9 rounded-lg cursor-default',
            ]"
          >
            <span
              v-if="selected"
              class="flex-none"
            >✅</span>
            <span
              v-if="item.type === 'text' || item.type === 'color'"
              class="flex-1 truncate"
            >{{ item.textInfo?.metadata }}</span>
            <span
              v-if="item.type === 'image'"
              class="flex-1 truncate"
            >{{
              item.imageInfo?.metadata
            }}</span>
          </li>
        </ListOption>
      </ListOptions>
    </List>
  </div>
</template>
