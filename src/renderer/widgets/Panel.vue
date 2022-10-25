<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";

import SearchBar from "/@/components/SearchBar.vue";
import Preview from "/@/components/Preview.vue";
import { useClipboard } from "/@/hooks/@electron/use-clipboard";
import Listbox from "/@/components/Listbox.vue";

import { useClipboardListener } from "/@/hooks/@electron/use-clipboard-listener";
import { useCopylistStore } from "../../lib/stores/copylist-store";
import { useValidateColor } from "../hooks/use-validate-color";
import { storeToRefs } from "pinia";

const clipboardListener = useClipboardListener();
const copylistStore = useCopylistStore();
const clipboard = useClipboard();

const { copylist } = storeToRefs(copylistStore);

const search = ref("");

watchEffect(() => {
  clipboardListener.startListening().on("text", async () => {
    const context = clipboard.readText();
    if (context != null) {
      await copylistStore.addCopylistItem({
        type: useValidateColor(context).isColor ? "color" : "text",
        context: context,
        textInfo: {
          metadata: context,
          color: useValidateColor(context).color,
        },
        createdAt: new Date().getTime().toString(),
      });
      console.log("copylist", copylist.value.length, copylist.value);
    }
  });
});

const filteredClips = computed(() =>
  copylist.value.filter(({ id, textInfo, createdAt }) => {
    const metadata = textInfo?.metadata;
    [id, metadata, createdAt].some((val) =>
      val?.toString().toLocaleLowerCase().includes(search.value)
    );
  })
);
</script>

<template>
  <main>
    <SearchBar></SearchBar>
    {{JSON.stringify(copylistStore.copylist)}}
    <section
      class="flex h-96 border-b"
      v-if="copylistStore.copylist.length > 0"
    >
      <div
        class="flex-1 overflow-y-auto scrollbar scrollbar-xs scrollbar-thumb-blue-400 scrollbar-rounded-2"
      >
        <Listbox></Listbox>
      </div>
      <div class="flex-none overflow-y-auto">
        <!-- <Preview></Preview> -->
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
