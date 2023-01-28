<template>
  <div class="change flex flex-column flex-center flex-only-center">
    <div class="title">「灰鲸·禹迹」修改手机号</div>
    <Step :step-active="state.stepActive" :step-title="state.stepTitle" />
    <div v-if="state.stepActive === 0">
      <p class="hint">
        手机验证码验证 账户 <span>{{ state.phoneStar }}</span> 为确认是你本人操作，请完成以下验证
      </p>
      <Message @handle-submit-message="handleSubmitMessage" />
    </div>
    <div v-if="state.stepActive === 1">
      <Message :type="4" @handle-submit-mobile="handleSubmitMobile" />
    </div>
    <div v-if="state.stepActive === 2">
      <Complete :complete-official="state.completeOfficial" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue-demi'
import { ElMessage } from 'element-plus'
import { Passport } from '@gwin/platform-passport-pc'
import { getUserId } from '@/utils/auth'
import { phoneStar } from '@/utils/index'

import Step from '@/components/Step/index.vue'
import Message from '@/components/Form/message.vue'
import Complete from '@/components/Form/complete.vue'

const state = reactive({
  stepActive: 0, // 步骤
  stepTitle: ['验证身份', '修改手机', '完成'], // 步骤标题
  phoneStar: phoneStar(<string>localStorage.getItem('mobile')),
  userMobile: <string>localStorage.getItem('mobile'),
  completeOfficial: {
    title: '',
    describe: '此手机号码可作为安全验证的方式用于找回密码、修改手机等场景，但不能作为登录名使用',
    login: false
  },
  pinCodeToken: '' // 验证码token
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
 * 修改新的手机号
 */
const handleSubmitMobile = (messageForm: any) => {
  const userId = getUserId() || ''
  changePhone(messageForm.mobile, messageForm.pinCode, state.pinCodeToken, userId)
}

/**
 * 修改手机号
 * @param mobile 新手机号
 * @param pinCode 短信验证码
 * @param pinCodeToken 旧手机号验证码Token
 * @param userId 用户Id
 * @returns
 */
const changePhone = async (mobile: string, pinCode: string, pinCodeToken: string, userId: string) => {
  try {
    const res = await Passport.changePhone(mobile, pinCode, pinCodeToken, userId)
    localStorage.setItem('mobile', mobile)
    state.completeOfficial.title = `您的手机号码修改为 ${mobile}`
    ElMessage.success('手机号修改成功')
    state.pinCodeToken = res.body.pinCodeToken
    state.stepActive = 2
  } catch (error) {}
}
</script>

<style lang="scss" scoped>
.change {
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
    margin-bottom: 60px;
  }
  .hint {
    color: #6e6e6e;
    font-size: 14px;
    margin-top: -30px;
    margin-bottom: 65px;
    span {
      color: #3c7dff;
    }
  }
}
</style>
