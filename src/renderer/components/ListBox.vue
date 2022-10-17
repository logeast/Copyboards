<script setup lang="ts">
import { ref } from "vue";

import { List, ListOptions, ListOption } from "./@headless/list";
import { ListboxItemProps } from "./share-types";

interface Props {
  data: ListboxItemProps[];
}

withDefaults(defineProps<Props>(), {});

const selectedItem = ref();
</script>

<template>
  <div class="px-3">
    <List as="div" v-model="selectedItem">
      <div class="text-red-500 text-ellipsis overflow-hidden whitespace-nowrap">
        selected: {{ selectedItem?.text }}
      </div>
      <ListOptions>
        <ListOption v-slot="{ selected }" v-for="item in data" :key="item.text" :value="item">
          <li :class="[
            { 'text-white bg-blue-500': selected },
            'flex items-center justify-between px-2 gap-2 h-9 rounded-lg cursor-pointer',
          ]">
            <span class="flex-none" v-if="selected">✅</span>
            <span class="flex-1 truncate">{{ item.text }}</span>
          </li>
        </ListOption>
      </ListOptions>
    </List>
  </div>
</template>
