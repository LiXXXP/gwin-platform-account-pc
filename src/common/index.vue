<template>
  <div style="height: 100%">
    <Header />
    <div class="app-main flex">
      <Content class="app-content" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Header from './header.vue'
import Content from './content.vue'
</script>

<style lang="scss" scoped>
.app-main {
  width: 100%;
  overflow: hidden;
  height: calc(100vh - 52px);
  background-color: #f8fbff;
  position: relative;
  top: 0px;
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
