<template>
  <div>
    <input type="search">
  </div>
</template>

<script lang=ts>
import { defineComponent, reactive, toRefs } from 'vue';
import { useService } from '../composables';

export default defineComponent({
  setup() {
    const { getBasicInformation } = useService('BaseService');
    const data = reactive({
      version: '',
      path: '',
      platform: '',
    });
    getBasicInformation().then(({ version, platform, root }) => {
      data.version = version;
      data.path = root;
      data.platform = platform;
    });
    return {
      ...toRefs(data),
    };
  },
});
</script>
