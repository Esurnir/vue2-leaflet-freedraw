<script lang="ts">
import Vue from 'vue';
import LFreedraw from '@/l-freedraw.vue';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    LFreedraw
  }
});
</script>

<template>
  <div id="app">
    <l-freedraw />
  </div>
</template>
