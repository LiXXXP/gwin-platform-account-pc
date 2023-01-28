<template>
  <div class="header flex flex-only-center">
    <img src="../assets/imgs/hj-logo.png" class="logo" @click="onClickLogoToGwin" />
  </div>
</template>

<script lang="ts" setup>
import config from '../config'
/**
 * 点击 logo 跳转官网
 */
const onClickLogoToGwin = () => {
  window.location.href = config.GWIN_URL_HOME
}
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 50px;
  background-color: #2a2f37;
  .logo {
    width: 140px;
    height: 36px;
    cursor: pointer;
    margin-left: 24px;
  }
}
</style>
