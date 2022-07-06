<script setup lang="ts">
import { useClipboard } from '../composables';
import { ref, computed, watchEffect } from 'vue';
const { readText } = useClipboard();

interface ClipType {
  id: number;
  text: string;
  date: Date;
};

let uuid = 1000;
const clips = ref<ClipType[]>([
  { id: uuid++, text: '🎉 Congratulate!', date: new Date() }
]);

const search = ref('');

function addClip() {
  const text = readText();
  if (text !== undefined && clips.value[0].text !== text) {
    clips.value.unshift({ id: uuid++, text, date: new Date() });
  }
}

function removeClip(clip: ClipType) {
  clips.value = clips.value.filter(c => c !== clip);
}

const filteredClips = computed(() => clips.value.filter(
  ({ id, text, date }) => [id, text, date].some(val => val.toString().includes(search.value))
));

watchEffect(() => setInterval(addClip, 1000));

</script>

<template>
  <input type="search" v-model.trim="search">
  <ul>
    <li v-for="clip in filteredClips" :key="clip.id">
      <span>{{ clip.text }}</span>
      <span>{{ clip.date.getTime() }}</span>
      <button @click="removeClip(clip)">x</button>
    </li>
  </ul>
</template>
