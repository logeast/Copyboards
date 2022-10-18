<script setup lang="ts">
import { InputHTMLAttributes } from "vue";

interface SearchBarProps {
  placeholder?: InputHTMLAttributes["placeholder"];
}

withDefaults(defineProps<SearchBarProps>(), {
  placeholder: "Copyboards Search ",
});
</script>

<template>
  <section
    class="flex items-center justify-between border-b px-3 gap-2 rounded-t-2xl bg-gray-100/90 backdrop-blur-xl"
    style="height: 56px"
  >
    <span class="text-gray-600">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        ></path>
      </svg>
    </span>
    <input
      class="flex-1 h-full outline-none bg-transparent text-lg placeholder:text-gray-400 placeholder:font-normal"
      autofocus
      :placeholder="placeholder"
    />
    <div class="flex items-center justify-center w-6">
      <slot></slot>
    </div>
  </section>
</template>
