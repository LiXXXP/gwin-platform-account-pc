<template>
  <div class="timer">
    <el-button
      :class="['message-btn', { disabled: props.messageDisabled }]"
      :disabled="props.messageDisabled"
      @click="handleGetMessage"
      >{{ state.times === 60 ? '获取验证码' : state.times + 'S' }}</el-button
    >
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue-demi'
import { ElMessage } from 'element-plus'
import { Passport } from '@gwin/platform-passport-pc'

interface Props {
  messageDisabled?: boolean
  passportNo?: string
  type?: number
}

const props = withDefaults(defineProps<Props>(), {
  messageDisabled: false,
  passportNo: '',
  type: 1
})

const emit = defineEmits(['messageDisabled'])

const state = reactive({
  times: 60,
  timer: <any>{}
})

/**
 * 获取短信验证码
 */
const handleGetMessage = async () => {
  try {
    await Passport.sendPinCode(props.passportNo, props.type)
    emit('messageDisabled', true, state.times)
    ElMessage.success('验证码发送成功')
    state.timer = setInterval(() => {
      state.times--
      if (state.times === 0) {
        emit('messageDisabled', false, state.times)
        clearInterval(state.timer)
        state.times = 60
      }
    }, 1000)
  } catch (error) {}
}
</script>

<style lang="scss" scoped>
.message-btn {
  width: 120px;
  color: #fff;
  padding: 12px 0;
  font-size: 14px;
  text-align: center;
  background-color: #3c7dff;
  border-radius: 0px 4px 4px 0px;
  &.disabled {
    color: #6e6e6e;
    background-color: #f8f8f8;
  }
}
</style>
