<script setup lang="ts">
import { ref } from "vue";
import { List, ListOptions, ListOption } from "/@/components/@headless/list";

const people = [
  { id: 1, name: "Durward Reynolds", unavailable: false },
  { id: 2, name: "Kenton Towne", unavailable: false },
  { id: 3, name: "Therese Wunsch", unavailable: false },
  { id: 4, name: "Benedict Kessler", unavailable: true },
  { id: 5, name: "Katelyn Rohan", unavailable: false },
];

const selectedPerson = ref(people[0]);

</script>

<template>
  <List as="div" v-model="selectedPerson">
    <div class="text-red-500">selected: {{ selectedPerson.name }}</div>
    <ListOptions>
      <ListOption
        v-slot="{ selected }"
        v-for="person in people"
        :key="person.name"
        :value="person"
      >
        <li
          :class="[
            selected ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
            'relative cursor-default select-none py-2 pl-10 pr-4',
          ]"
        >
          <span v-if="selected">✅</span>
          <span>{{ person.name }}</span>
        </li>
      </ListOption>
    </ListOptions>
  </List>
</template>
