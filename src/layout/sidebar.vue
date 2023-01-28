<template>
  <div>
    <console-menu :menu-list="data.menuList" />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const data = reactive({
  menuList: [
    {
      title: '个人中心',
      icon: 'gwin-product-service',
      child: [
        {
          title: '基本信息',
          router: '/account/information',
          icon: ''
        },
        {
          title: '安全设置',
          router: '/account/settings',
          icon: ''
        }
      ]
    }
  ]
})
</script>

<style lang="scss" scoped></style>
