<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import DataStore from "electron-store";

import SearchBar from "/@/components/SearchBar.vue";
import Preview from "/@/components/Preview.vue";
import { useClipboard } from "/@/hooks/@electron/use-clipboard";
import Listbox from "/@/components/Listbox.vue";

import { useClipboardListener } from "/@/hooks/@electron/use-clipboard-listener";
import { useListStore } from "/@/stores/list-store";
import { useValidateColor } from "../hooks/use-validate-color";

const clipboardListener = useClipboardListener();
const listStore = useListStore();
const clipboard = useClipboard();

/** Store user data into a json file */
const dataStore = new DataStore();

let uuid = 1000;

const search = ref("");

watchEffect(() => {
  document.addEventListener("click", (e) => {
    // clipboardListener.stopListening();
  });

  clipboardListener
    .startListening()
    .on("text", (e) => {
      const text = clipboard.readText();
      if (
        text !== undefined &&
        listStore.datalist[0]?.textInfo?.metadata !== text
      ) {
        listStore.datalist.unshift({
          id: uuid++,
          type: useValidateColor(text).isColor ? "color" : "text",
          textInfo: { metadata: text, color: useValidateColor(text).color },
          datetime: new Date().getTime().toString(),
        });
        dataStore.set("datalist", listStore.datalist);
        console.log("datalist in store", dataStore.get("datalist"));
      }
    })
    .on("image", (e) => {
      const image = clipboard.readImage();
      if (image) {
        listStore.datalist.unshift({
          id: uuid++,
          type: "image",
          imageInfo: { metadata: image.toDataURL() },
          datetime: new Date().getTime().toString(),
        });
      }
    });
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
    <section class="flex h-96 border-b" v-if="listStore.datalist.length > 0">
      <div
        class="flex-1 overflow-y-auto scrollbar scrollbar-xs scrollbar-thumb-blue-400 scrollbar-rounded-2"
      >
        <Listbox :data="filteredClips"></Listbox>
      </div>
      <div class="flex-none overflow-y-auto">
        <Preview></Preview>
      </div>
    </section>
    <section
      class="flex h-96 border-b flex-col gap-1 items-center justify-center"
      v-else
    >
      <img src="../assets/empty-box.png" class="w-48" alt="" />
      <p class="text-gray-400">It is empty here.</p>
    </section>
  </main>
</template>
