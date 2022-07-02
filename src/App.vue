<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { ref } from 'vue';
import CopyItem from './components/CopyItem.vue'
import DarkMode from './components/DarkMode.vue';

const copylist = ref([
    { id: 0, text: '为众人抱薪者，不可使其冻毙于风雪。' },
    { id: 1, text: '为大众谋福利者，不可使其孤军奋战。' },
    { id: 2, text: '为自由开路者，不可使其困顿于荆棘。' },
    { id: 3, text: '遍身罗绮者，不是养蚕人。' },
    { id: 4, text: '朱门酒肉臭，路有冻死骨。' }
])
</script>

<template>
    <DarkMode></DarkMode>
    <ul>
        <CopyItem v-for="item in copylist" :value="item" :key="item.id"></CopyItem>
    </ul>
</template>
