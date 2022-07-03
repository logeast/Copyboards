<script setup lang="ts">
import { useClipboard } from '../composables'
import { ref, onMounted } from 'vue'

const { readText } = useClipboard()

let uuid = 1000
const clips = ref([
    { id: uuid++, text: '🎉 Congratulation!' }
])

function addClip() {
    const text = readText();
    console.log(text, clips.value);
    if (clips.value[0].text !== text) {
        clips.value.unshift({ id: uuid++, text })
    }
}

onMounted(() => setInterval(addClip, 1000))

</script>

<template>
    <ul>
        <li v-for="clip in clips" :key="clip.id">
            <span>{{ clip.text }}</span>
        </li>
    </ul>
</template>
