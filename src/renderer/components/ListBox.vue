<script setup lang="ts">
import { List, ListOptions, ListOption } from "./@headless/list";
import { useListStore } from "/@/stores/list-store";

const listStore = useListStore();
</script>

<template>
  <div class="px-3">
    <List as="div" v-model="listStore.selectedItem">
      <div class="text-red-500 text-ellipsis overflow-hidden whitespace-nowrap">
        selected: {{ listStore.selectedItem?.textInfo?.metadata }}
      </div>
      <ListOptions>
        <ListOption
          v-slot="{ selected }"
          v-for="item in listStore.datalist"
          :key="item.id"
          :value="item"
        >
          <li
            :class="[
              { 'text-white bg-blue-500': selected },
              'flex items-center justify-between px-2 gap-2 h-9 rounded-lg cursor-pointer',
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
