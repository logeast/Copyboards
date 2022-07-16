<script setup lang="ts">
import { ref } from 'vue';
import ListItem, { ListItemProps } from './ListItem.vue';

interface Props {
  data: ListItemProps[];
}

withDefaults(defineProps<Props>(), {
});

const active = ref(false);

</script>

<template>
  <ul class="px-3 py-2">
    <ListItem v-for="(item) in data" :key="item.id" :text="item.text" :active="item?.active">
    </ListItem>
  </ul>
</template>
