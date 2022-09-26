<script setup lang="ts">
import { List, ListOptions, ListOption } from "/@/components/@headless/list";

const people = [
  { name: "Wade Cooper" },
  { name: "Arlene Mccoy" },
  { name: "Devon Webb" },
  { name: "Tom Cook" },
  { name: "Tanya Fox" },
  { name: "Hellen Schmidt" },
];
</script>

<template>
  <List as="div">
    <ListOptions>
      <ListOption
        v-slot="{ selected }"
        v-for="person in people"
        :key="person.name"
        :value="person"
      >
        <span v-if="selected">✅</span>
        <span>{{ person.name }}</span>
      </ListOption>
    </ListOptions>
  </List>
</template>
