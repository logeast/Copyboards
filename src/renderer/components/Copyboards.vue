<script setup lang="ts">
import { useClipboard } from '../composables';
import { ref, computed, watchEffect } from 'vue';
import { nativeImage } from 'electron';
import SearchBar from './SearchBar.vue';
import List from './List.vue';
import { ListItemProps } from './ListItem.vue';
import Preview from './Preview.vue';
import Combobox from './Combobox.vue';
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
  },
});

clipboardObserver.start();

let uuid = 1000;
const clips = ref<ListItemProps[]>([
  { id: uuid++, text: '🎉 Congratulate!', date: new Date(), active: true }
]);

const search = ref('');

function addClip() {
  const text = readText();
  if (text !== undefined && clips.value[0].text !== text) {
    clips.value.unshift({ id: uuid++, text, date: new Date() });
  }
}

function removeClip(clip: ListItemProps) {
  clips.value = clips.value.filter(c => c !== clip);
}

const filteredClips = computed(() => clips.value.filter(
  ({ id, text, date }) => [id, text, date].some(
    val => val?.toString().toLocaleLowerCase().includes(search.value)
  )
));

watchEffect(() => setInterval(addClip, 1000));

</script>

<template>
  <main>
    <!-- <Combobox></Combobox> -->
    <SearchBar></SearchBar>
    <section class="flex h-96 border-b">
      <div class="flex-1 overflow-y-auto">
        <List :data="filteredClips"></List>
      </div>
      <div class="flex-none overflow-y-auto">
        <Preview></Preview>
      </div>
    </section>
  </main>
</template>
