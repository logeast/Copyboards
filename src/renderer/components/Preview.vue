<script setup lang="ts">

interface PreviewProps {
  type?: 'text' | 'image' | 'color';
  text?: string;
  img?: string;
  color?: string;
}

withDefaults(defineProps<PreviewProps>(), {
  type: 'color',
  text: 'This section describes major releases and their improvements. For a detailed list of changes please refer to the change log.',
  img: 'https://interactive-examples.mdn.mozilla.net/media/cc0-images/elephant-660-480.jpg',
  color: '#3B82F6',
});

</script>

<template>
  <section class="relative flex flex-col border-l h-full" style="width: 390px">

    <article class="flex-1 overflow-y-auto p-4" v-if="type === 'text'">
      {{ text }}
    </article>

    <figure class="w-full h-full p-4 overflow-hidden flex flex-col gap-2" v-if="type === 'image'">
      <p class="flex-none truncate">{{ text }}</p>
      <figure class="flex items-center justify-center flex-1 overflow-hidden">
        <img class="max-w-full max-h-full" :src="img">
      </figure>
    </figure>

    <div class="w-full h-full p-4 overflow-hidden flex flex-col gap-2" v-if="type === 'color'">
      <p class="flex-none truncate">{{ color }}</p>
      <div class="flex items-center justify-center flex-1 overflow-hidden" :style="{ 'background-color': color }">
      </div>
    </div>

    <footer
      class="sticky bottom-0 p-2 border-t z-10 bg-gray-50/80 backdrop-blur-2xl flex-none flex flex-col items-center justify-center gap-1">
      <p class="text-xs text-gray-500">12 words; 128 chars</p>
      <p class="text-xs text-gray-500">Copied Today at 13:20</p>
    </footer>

  </section>
</template>
