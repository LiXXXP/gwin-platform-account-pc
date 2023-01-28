<template>
  <div class="forget flex flex-column flex-center flex-only-center">
    <div class="title">「灰鲸·禹迹」账号密码找回</div>
    <Step :step-active="state.stepActive" :step-title="state.stepTitle" />
    <div v-if="state.stepActive === 0">
      <Message @handle-submit-message="handleSubmitMessage" />
    </div>
    <div v-if="state.stepActive === 1">
      <Password @handle-submit-password="handleSubmitPassword" />
    </div>
    <div v-if="state.stepActive === 2">
      <Complete :complete-official="state.completeOfficial" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue-demi'
import { Passport } from '@gwin/platform-passport-pc'

import { ElMessage } from 'element-plus'

import Step from '@/components/Step/index.vue'
import Message from '@/components/Form/message.vue'
import Password from '@/components/Form/password.vue'
import Complete from '@/components/Form/complete.vue'

const state = reactive({
  stepActive: 0, // 步骤
  stepTitle: ['验证身份', '重置登录密码', '完成'], // 步骤标题
  completeOfficial: {
    title: '重置成功',
    describe: '请牢记新的登录密码',
    login: true
  },
  pinCodeToken: ''
})

/**
 * 手机号 验证码 提交
 */
const handleSubmitMessage = (messageForm: any) => {
  verifyPhone(messageForm.mobile, messageForm.pinCode)
}

/**
 * 验证手机
 * @param mobile 手机号
 * @param pinCode 短信验证码
 */
const verifyPhone = async (mobile: string, pinCode: string) => {
  try {
    const res = await Passport.verifyPhone(mobile, pinCode)
    ElMessage.success('手机验证成功')
    state.pinCodeToken = res.body.pinCodeToken
    state.stepActive = 1
  } catch (error) {}
}

/**
 * 密码重置
 */
const handleSubmitPassword = (newPassword: string) => {
  changePassowrd(newPassword)
}

/**
 * 修改密码，重置密码
 * @param newPassword 新密码
 * @param pinCodeToken 手机验证短信Token
 */
const changePassowrd = async (newPassword: string) => {
  try {
    await Passport.changePassowrd(newPassword, state.pinCodeToken)
    ElMessage.success('重置密码成功')
    state.stepActive = 2
  } catch (error) {}
}
</script>

<style lang="scss" scoped>
.forget {
  width: 90%;
  min-width: 600px;
  margin: 50px auto;
  height: calc(100vh - 210px);
  min-height: 550px;
  background-color: #fff;
  .title {
    color: #121212;
    font-size: 34px;
    font-weight: 500;
    text-align: center;
    margin-bottom: 80px;
  }
}
</style>
