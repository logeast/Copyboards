<template >
  <div class="app">
    <!-- <navigator /> -->
    <Copyboards />
    <!-- <router-view> </router-view> -->
  </div>
</template>

<script lang=ts>
import { defineComponent } from 'vue'
import Navigator from '/@/components/HomeNavigator.vue'
import Copyboards from './components/Copyboards.vue'

export default defineComponent({
  components: {
    Navigator,
    Copyboards
  }
})
</script>

<style>
</style>
