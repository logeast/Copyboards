<script setup lang="ts">
import { useClipboard } from '../composables';
import { ref, onMounted } from 'vue';

let id = 10001;

const newClip = ref('');

const clips = ref([
  { id: id++, text: '🍒 Select some text and press ctl/cmd + c', time: new Date() },
  { id: id++, text: '🎉 Congratulation!', time: new Date() }
]);

function addClip() {
  clips.value.push({ id: id++, text: newClip.value, time: new Date() });
  newClip.value = '';
}

function removeClip(clip: any) {
  clips.value = clips.value.filter(c => c !== clip);
}

// let timer;
// const duration = ref(500);

// function textChange() {
//   return false;
// }

// function setTimer() {
//   timer = setInterval(() => {
//     if (textChange()) {
//       const { readText } = useClipboard();
//     }
//   }, duration.value);
// }

// const { readText } = useClipboard();

// let uuid = 1000;
// const clips = ref([
//   { id: uuid++, text: '🎉 Congratulation!' }
// ]);

// function getCopiedText() {
//   const text = readText();
//   console.log(text, clips.value);
//   if (clips.value[0].text !== text) {
//     clips.value.unshift({ id: uuid++, text });
//   }
// }

// onMounted(() => setInterval(getCopiedText, 1000));

</script>

<template>
  <ul class="text-black">
    <li class="py-4 border-b border-green-400 bg-green-200 flex gap-4" v-for="clip in clips" :key="clip.id">
      <span>{{ clip.id }}</span>
      <span>{{ clip.text }}</span>
      <span>{{ clip.time.getTime() }}</span>
      <button class="text-red-600" @click="removeClip(clip)">X</button>
    </li>
  </ul>
</template>
