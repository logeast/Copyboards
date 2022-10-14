<script setup lang="ts">
import { ref } from "vue";
import ListItem, { ListItemProps } from "./ListItem.vue";

export interface ItemProps {
  id?: string | number;
  icon?: HTMLElement;
  text?: string;
  active?: boolean;
  date?: Date;
}

interface Props {
  data: ItemProps[];
}

withDefaults(defineProps<Props>(), {});

const active = ref(0);

const people = [
  { id: 1, name: "Durward Reynolds", unavailable: false },
  { id: 2, name: "Kenton Towne", unavailable: false },
  { id: 3, name: "Therese Wunsch", unavailable: false },
  { id: 4, name: "Benedict Kessler", unavailable: true },
  { id: 5, name: "Katelyn Rohan", unavailable: false },
];

const selectedItem = ref(data[0]);

</script>

<template>
  <ul class="px-3 py-2">
    <list-item v-for="item in data" :key="item.id" :text="item.text" :active="active === item.id">
    </list-item>
  </ul>

  <List as="div" v-model="selectedItem">
    <div class="text-red-500">selected: {{ selectedItem.text }}</div>
    <ListOptions>
      <ListOption v-slot="{ selected }" v-for="person in data" :key="person.text" :value="person">
        <li :class="[
          selected ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
          'relative cursor-default select-none py-2 pl-10 pr-4',
        ]">
          <span v-if="selected">✅</span>
          <span>{{ person.text }}</span>
        </li>
      </ListOption>
    </ListOptions>
  </List>
</template>
