<script setup lang="ts">
import { ref } from "vue";
import { IAPICopylistItem } from "../../lib/api";
import { List, ListOptions, ListOption } from "../../lib/headless/list";

import { useCopylistStore } from "../../lib/stores/copylist-store";

const copylistStore = useCopylistStore();

const props = defineProps<{
  defaultValue?: IAPICopylistItem;
  data: IAPICopylistItem[];
}>();

const controlledValue = ref(props.defaultValue);

copylistStore.selectedItem = controlledValue.value;
</script>

<template>
  <section>
    <List as="div" v-model="controlledValue">
      <ListOptions>
        <ListOption
          v-slot="{ selected }"
          v-for="item in data"
          :key="item.id"
          :value="item"
        >
          <li
            :class="[
              { 'text-white bg-indigo-500': selected },
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
  </section>
</template>
