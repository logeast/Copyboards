<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption
} from '@headlessui/vue';
import { SearchIcon } from '@heroicons/vue/solid';

let uuid = 1000;
const clips = [
  { id: uuid++, text: '🎉 Congratulate!', date: new Date(), active: true },
  { id: uuid++, text: 'Copyboards - A Better Way to Copy and Paste!', date: new Date(), active: true },
  { id: uuid++, text: 'Copyboards - A Better Way to Copy and Paste! 🎉 Congratulate!', date: new Date(), active: true },
  { id: uuid++, text: 'Image: custom-search.png(1280x768, 1.25M)', date: new Date(), active: true },
  { id: uuid++, text: 'File: ~/document/copyboards/README.md(1.25M)', date: new Date(), active: true },
  { id: uuid++, text: '#C084FC', date: new Date(), active: true },
  { id: uuid++, text: 'This section describes major releases and their improvements. For a detailed list of changes …', date: new Date(), active: true }
];

const selected = ref(clips[0]);
const query = ref('');

const filteredClips = computed(() =>
  query.value === ''
    ? clips
    : clips.filter(({ id, text, date }) =>
      [id, text, date].some((val) =>
        val
          .toString()
          .toLocaleLowerCase()
          .includes(query.value.toLocaleLowerCase().replace(/\s+/g, ''))
      )
    )
);

</script>

<template>
  <Combobox v-model="selected">

    <section class="flex items-center justify-between border-b px-3 gap-2 rounded-t-2xl bg-gray-50/75 backdrop-blur-2xl"
      style="height: 56px">
      <SearchIcon class="h-6 w-6"></SearchIcon>
      <ComboboxInput
        class="flex-1 h-full outline-none bg-transparent text-lg placeholder:text-gray-500 placeholder:font-normal"
        :displayValue="(clip) => clip.text" @change="query = $event.target.value" placeholder="Copyboards Search">
      </ComboboxInput>
    </section>

    <ComboboxOptions static class="px-3 py-2">
      <section v-if="filteredClips.length === 0 && query !== ''"
        class="relative cursor-default select-none py-2 px-4 text-gray-700">
        Nothing found.
      </section>

      <ComboboxOption v-for="clip in filteredClips" as="template" :key="clip.id" :value="clip.text"
        v-slot="{ selected, active }">
        <li class="flex items-center justify-between px-2 gap-2 h-9 rounded-lg cursor-pointer" :class="{
          'bg-blue-500 text-white': selected || active,
        }">
          <div class="flex items-center justify-center w-4 h-4 flex-none"></div>

          <p class="flex-1 truncate" :title="clip.text">
            {{ clip.text }}
          </p>
        </li>
      </ComboboxOption>
    </ComboboxOptions>

  </Combobox>
</template>
