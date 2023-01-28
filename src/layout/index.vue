<template>
  <div style="height: 100%">
    <Header class="app-header" />
    <div class="app-main flex">
      <Sidebar v-if="!key" class="app-sidebar" />
      <Content class="app-content" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue-demi'
import { useRoute } from 'vue-router'

import Header from './header.vue'
import Sidebar from './sidebar.vue'
import Content from './content.vue'

const route = useRoute()
const key = computed(() => {
  return route.path.includes('changePassword') || route.path.includes('changeMobile')
})
</script>

<style lang="scss" scoped>
.app-main {
  width: 100%;
  overflow: hidden;
  height: calc(100vh - 52px);
  background-color: #f8fbff;
  position: relative;
  top: 50px;
  left: 0px;
  right: 0px;
}
.app-content {
  flex: 1;
  padding: 20px;
  overflow: auto;
  box-sizing: border-box;
}
</style>
