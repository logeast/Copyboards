<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from "vue";
import SearchBar from "./SearchBar.vue";
import List from "./List.vue";
import { ListItemProps } from "./ListItem.vue";
import Preview from "./Preview.vue";
import { useClipboard } from "/@/hooks/@electron/use-clipboard";

import { useClipboardListener } from "/@/hooks/@electron/use-clipboard-listener";

const clipboardListener = useClipboardListener();

const clipboard = useClipboard();

let uuid = 1000;
const clips = ref<ListItemProps[]>([
  { id: uuid++, text: "🎉 Congratulate!", date: new Date(), active: true },
]);

const search = ref("");

watchEffect(() => {
  document.addEventListener("click", (e) => {
    clipboardListener.stopListening();
  });

  clipboardListener
    .startListening()
    .on("text", (e) => {
      const text = clipboard.readText();
      if (text !== undefined && clips.value[0].text !== text) {
        clips.value.unshift({ id: uuid++, text, date: new Date() });
      }
    })
    .on("image", (e) => {
      const image = clipboard.readImage();
      if (image) {
        clips.value.unshift({
          id: uuid++,
          text: image.toDataURL(),
          date: new Date(),
        });
      }
    });
});

const filteredClips = computed(() =>
  clips.value.filter(({ id, text, date }) =>
    [id, text, date].some((val) =>
      val?.toString().toLocaleLowerCase().includes(search.value)
    )
  )
);

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
