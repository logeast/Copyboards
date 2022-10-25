<script setup lang="ts">
import { IAPICopylistItem } from "../../lib/api";
import { useDay } from "../../lib/hooks/use-day";

const props = defineProps<{
  data?: IAPICopylistItem;
}>();
console.log("selected data", props.data);
</script>

<template>
  <section class="relative flex flex-col border-l h-full" style="width: 390px">
    <div class="flex-1">
      <article
        class="w-full h-full overflow-y-auto p-4 break-all"
        v-if="data?.type === 'text'"
      >
        {{ data?.textInfo?.metadata }}
      </article>

      <figure
        class="w-full h-full p-4 overflow-hidden flex flex-col gap-2"
        v-if="data?.type === 'image'"
      >
        <p class="flex-none truncate">
          {{ data?.textInfo?.metadata }}
        </p>
        <figure class="flex items-center justify-center flex-1 overflow-hidden">
          <img class="max-w-full max-h-full" :src="data?.imageInfo?.metadata" />
        </figure>
      </figure>

      <div
        class="w-full h-full p-4 overflow-hidden flex flex-col gap-2"
        v-if="data?.type === 'color'"
      >
        <p class="flex-none truncate">
          {{ data?.textInfo?.metadata }}
        </p>
        <div
          class="flex items-center justify-center flex-1 overflow-hidden"
          :style="{
            'background-color': data?.textInfo?.color,
          }"
        ></div>
      </div>
    </div>

    <footer
      class="sticky bottom-0 p-2 border-t z-10 bg-gray-100/90 backdrop-blur-xl flex-none flex flex-col items-center justify-center gap-1"
    >
      <p class="text-xs text-gray-500">
        {{ data?.textInfo?.metadata?.split(" ").length || 0 }}
        words;
        {{ data?.textInfo?.metadata?.length || 0 }} chars
      </p>
      <p class="text-xs text-gray-500">
        Copied {{ useDay(data?.createdAt || "").date }} at
        {{ useDay(data?.createdAt || "").time }}
      </p>
    </footer>
  </section>
</template>
