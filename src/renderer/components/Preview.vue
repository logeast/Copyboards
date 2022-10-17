<script setup lang="ts">
import { useListStore } from "/@/stores/list-store";

const listStore = useListStore();
</script>

<template>
  <section class="relative flex flex-col border-l h-full" style="width: 390px">
    <article
      class="flex-1 overflow-y-auto p-4"
      v-if="listStore.selectedItem.type === 'text'"
    >
      {{ listStore.selectedItem.textInfo?.metadata }}
    </article>

    <figure
      class="w-full h-full p-4 overflow-hidden flex flex-col gap-2"
      v-if="listStore.selectedItem.type === 'image'"
    >
      <p class="flex-none truncate">
        {{ listStore.selectedItem.textInfo?.metadata }}
      </p>
      <figure class="flex items-center justify-center flex-1 overflow-hidden">
        <img
          class="max-w-full max-h-full"
          :src="listStore.selectedItem.imageInfo?.metadata"
        />
      </figure>
    </figure>

    <div
      class="w-full h-full p-4 overflow-hidden flex flex-col gap-2"
      v-if="listStore.selectedItem.type === 'color'"
    >
      <p class="flex-none truncate">
        {{ listStore.selectedItem.textInfo?.metadata }}
      </p>
      <div
        class="flex items-center justify-center flex-1 overflow-hidden"
        :style="{ 'background-color': listStore.selectedItem.textInfo?.color }"
      ></div>
    </div>

    <footer
      class="sticky bottom-0 p-2 border-t z-10 bg-gray-50/75 backdrop-blur-xl flex-none flex flex-col items-center justify-center gap-1"
    >
      <p class="text-xs text-gray-500">
        {{ listStore.selectedItem.textInfo?.metadata?.split(" ").length }}
        words; {{ listStore.selectedItem.textInfo?.metadata?.length }} chars
      </p>
      <p class="text-xs text-gray-500">Copied Today at 13:20</p>
    </footer>
  </section>
</template>
