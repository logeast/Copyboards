<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import SearchBar from "/@/components/SearchBar.vue";
import Preview from "/@/components/Preview.vue";
import { useClipboard } from "/@/hooks/@electron/use-clipboard";
import ListBox from "/@/components/Listbox.vue";

import { useClipboardListener } from "/@/hooks/@electron/use-clipboard-listener";
import { useListStore } from "/@/stores/list-store";
import { useValidateColor } from "../hooks/use-validate-color";

const clipboardListener = useClipboardListener();
const listStore = useListStore();

const clipboard = useClipboard();

let uuid = 1000;

const search = ref("");

watchEffect(() => {
  document.addEventListener("click", (e) => {
    // clipboardListener.stopListening();
  });

  clipboardListener.startListening().on("text", (e) => {
    const text = clipboard.readText();
    if (
      text !== undefined &&
      listStore.datalist[0]?.textInfo?.metadata !== text
    ) {
      listStore.datalist.unshift({
        id: uuid++,
        type: useValidateColor(text).isColor ? "color" : "text",
        textInfo: { metadata: text, color: useValidateColor(text).color },
        datetime: new Date(),
      });
    }
  });
  // .on("image", (e) => {
  //   const image = clipboard.readImage();
  //   if (image) {
  //     clips.value.unshift({
  //       id: uuid++,
  //       text: image.toDataURL(),
  //       date: new Date(),
  //     });
  //   }
  // });
});

const filteredClips = computed(() =>
  listStore.datalist.filter(({ id, textInfo, datetime }) => {
    const metadata = textInfo?.metadata;
    [id, metadata, datetime].some((val) =>
      val?.toString().toLocaleLowerCase().includes(search.value)
    );
  })
);
</script>

<template>
  <main>
    <SearchBar></SearchBar>
    <section class="flex h-96 border-b">
      <div class="flex-1 overflow-y-auto">
        <ListBox :data="filteredClips"></ListBox>
      </div>
      <div class="flex-none overflow-y-auto">
        <Preview></Preview>
      </div>
    </section>
  </main>
</template>
