<script setup lang="ts">
import { useClipboard } from '../composables';
import { ref, computed, watchEffect } from 'vue';
import { nativeImage } from 'electron';
import SearchBar from './searchbar.vue';
const { readText, readImage } = useClipboard();

interface Options {
  duration?: number;
  textChange?: (text: string, beforeText: string) => void;
  imageChange?: (image: nativeImage, beforeImage: nativeImage) => void
}

class ClipboardObserver {
  timer: any;
  beforeText: string;
  beforeImage: string;

  duration = 500;
  textChange: (text: string, beforeText: string) => void;
  imageChange: (image: nativeImage, beforeImage: nativeImage) => void;

  constructor(options: Options) {
    const { duration, textChange, imageChange } = options;

    this.duration = duration;
    this.textChange = textChange;
    this.imageChange = imageChange;

    if (this.textChange || this.imageChange) {
      this.start();
    }
  }

  start(): void {

  }

  stop(): void {
    this.setTimer();
  }

  clearTimer(): void {
    clearInterval(this.timer);
  }

  setClipboardDefaultValue(): void {
    if (this.textChange) {
      this.beforeText = readText();
    }
    if (this.imageChange) {
      this.beforeImage = readImage();
    }
  }

  setTimer(): void {
    const callback = () => {
      if (this.textChange) {
        const text = readText();
        if (this.isDiffText(this.beforeText, text)) {
          this.textChange(text, this.beforeText);
          this.beforeText = text;
        }
      }

      if (this.imageChange) {
        const image = readImage();

        if (this.isDiffImage(this.beforeImage, image)) {
          this.imageChange(image, this.beforeImage);
          this.beforeImage = image;
        }
      }
    };

    this.timer = setInterval(callback, this.duration);
  }

  isDiffText(beforeText: string, afterText: string): boolean {
    return Boolean(afterText) && beforeText !== afterText;
  }

  isDiffImage(beforeImage: nativeImage, afterImage: nativeImage): boolean {
    return Boolean(afterImage) && !afterImage.isEmpty() && beforeImage.toDataURL() !== afterImage.toDataURL();
  }
}

const clipboardObserver = new ClipboardObserver({
  textChange: (text: string, beforeText: string) => {
    console.log('text', text);
  },
  imageChange: (image: nativeImage, beforeImage: nativeImage) => {
    console.log('image', image);
  }
});

clipboardObserver.start();

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
  ({ id, text, date }) => [id, text, date].some(
    val => val.toString().toLocaleLowerCase().includes(search.value)
  )
));

watchEffect(() => setInterval(addClip, 1000));

</script>

<template>
  <!-- <input type="search" v-model.trim="search"> -->
  <search-bar></search-bar>
  <ul>
    <li v-for="clip in filteredClips" :key="clip.id">
      <span>{{ clip.text }}</span>
      <span>{{ clip.date.getTime() }}</span>
      <button @click="removeClip(clip)">x</button>
    </li>
  </ul>
</template>
