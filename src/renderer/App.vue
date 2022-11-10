<script setup lang="ts">
import { watchEffect } from "vue";
import { useClipboard } from "../lib/electron-hooks/use-clipboard";

import SearchBar from "../renderer/components/SearchBar.vue";
import Preview from "../renderer/components/Preview.vue";
import PanelLayout from "../renderer/components/PanelLayout.vue";
import Copylist from "../renderer/components/Copylist.vue";

import { useClipboardListener } from "../lib/electron-hooks/use-clipboard-listener";
import { useCopylistStore } from "../lib/stores/copylist-store";
import { useValidateColor } from "../lib/hooks/use-validate-color";
import { storeToRefs } from "pinia";

const clipboardListener = useClipboardListener();
const copylistStore = useCopylistStore();
const clipboard = useClipboard();

const { copylist } = storeToRefs(copylistStore);

// const search = ref("");

watchEffect(() => {
  clipboardListener.startListening().on("text", async () => {
    const context = clipboard.readText();
    if (context != null) {
      await copylistStore.addCopylistItem({
        type: useValidateColor(context).isColor ? "color" : "text",
        context,
        textInfo: {
          metadata: context,
          color: useValidateColor(context).color,
        },
        createdAt: new Date().toString(),
      });
      console.log("copylist", copylist.value.length, copylist.value);
    }
  });
});

// const filteredClips = computed(() =>
//   copylist.value.filter(({ id, textInfo, createdAt }) => {
//     const metadata = textInfo?.metadata;
//     [id, metadata, createdAt].some((val) =>
//       val?.toString().toLocaleLowerCase().includes(search.value),
//     );
//   }),
// );
</script>

<template>
  <PanelLayout
    :empty="!copylistStore.copylist"
    :preview="!!copylistStore.copylist"
  >
    <template #header>
      <SearchBar />
    </template>

    <template #copylist>
      <Copylist :data="copylistStore.copylist" />
    </template>

    <template #preview>
      <Preview :data="copylistStore.selectedItem" />
    </template>
  </PanelLayout>
</template>
