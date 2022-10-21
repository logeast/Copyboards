<script setup lang="ts">
import { List, ListOptions, ListOption } from "./@headless/list";
import { useCopylistStore } from "../stores/copylist-store";

const copylistStore = useCopylistStore();
</script>

<template>
  <div class="px-3 py-2">
    <List as="div" v-model="copylistStore.selectedItem">
      <ListOptions>
        <ListOption
          v-slot="{ selected }"
          v-for="item in copylistStore.datalist"
          :key="item.id"
          :value="item"
        >
          <li
            :class="[
              { 'text-white bg-blue-500': selected },
              'flex items-center justify-between px-2 gap-2 h-9 rounded-lg cursor-default',
            ]"
          >
            <span class="flex-none" v-if="selected">✅</span>
            <span
              class="flex-1 truncate"
              v-if="item.type === 'text' || item.type === 'color'"
              >{{ item.textInfo?.metadata }}</span
            >
            <span class="flex-1 truncate" v-if="item.type === 'image'">{{
              item.imageInfo?.metadata
            }}</span>
          </li>
        </ListOption>
      </ListOptions>
    </List>
  </div>
</template>
