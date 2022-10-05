<script setup lang="ts">
import { useClipboard } from "../composables";
import { ref, computed, watchEffect } from "vue";
import { nativeImage } from "electron";
import SearchBar from "./SearchBar.vue";
import List from "./List.vue";
import { ListItemProps } from "./ListItem.vue";
import Preview from "./Preview.vue";

import { useClipboardObserve } from "/@/hooks/@electron/use-clipboard-observe";

const { readText } = useClipboard();

const clipboardObserver = useClipboardObserve({
  textChange: (text: string) => {
    console.log("text", text);
  },
  imageChange: (image: nativeImage) => {
    console.log("image", image);
  },
});

// clipboardObserver.start();

let uuid = 1000;
const clips = ref<ListItemProps[]>([
  { id: uuid++, text: "🎉 Congratulate!", date: new Date(), active: true },
]);

const search = ref("");

function addClip() {
  const text = readText();
  if (text !== undefined && clips.value[0].text !== text) {
    clips.value.unshift({ id: uuid++, text, date: new Date() });
  }
}

const filteredClips = computed(() =>
  clips.value.filter(({ id, text, date }) =>
    [id, text, date].some((val) =>
      val?.toString().toLocaleLowerCase().includes(search.value)
    )
  )
);

watchEffect(() => setInterval(addClip, 1000));
// watchEffect(() => clipboardObserver.start());
</script>

<template>
  <main>
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
