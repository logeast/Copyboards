<script setup lang="ts">
import ListItem, { ListItemProps } from './ListItem.vue';

interface Props {
  data: ListItemProps[];
}

withDefaults(defineProps<Props>(), {
});

</script>

<template>
  <ul class="p-2">
    <ListItem v-for="item in data" :key="item.id" :text="item.text" :active="item?.active">
    </ListItem>
  </ul>
</template>
