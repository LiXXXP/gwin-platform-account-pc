<template>
  <div class="dialog-content">
    <div class="hint">
      <p>您正在使用手机短信验证身份</p>
      <p>手机号码为：{{ state.phoneStar }}，有效期为 6 分钟</p>
    </div>
    <div class="code-input flex flex-row flex-between">
      <input
        v-for="(o, i) in state.list"
        :ref="
          (el) => {
            if (el) codeInputRefs[i] = el
          }
        "
        :key="i"
        v-model="o.val"
        type="text"
        maxlength="1"
        :class="{ focus: o.fs }"
        @focus="onFocus(i)"
        @blur="onBlur(i)"
        @input="onInput($event, i)"
      />
    </div>
    <div v-if="state.times === 60" class="hint">
      <span class="code" @click="handleGetMessage">发送验证码</span>
    </div>
    <div v-else class="hint">
      <span>{{ state.times }} 秒后可重新发送验证码</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watchEffect } from 'vue-demi'
import { nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Passport } from '@gwin/platform-passport-pc'
import { phoneStar } from '@/utils/index'

interface Props {
  initDialog?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initDialog: false
})

const emit = defineEmits(['getWritoffCode'])

const codeInputRefs = ref<HTMLInputElement | any>([])

const state = reactive({
  // 验证码的个数（现在是6个）
  list: [
    { val: '', fs: false },
    { val: '', fs: false },
    { val: '', fs: false },
    { val: '', fs: false },
    { val: '', fs: false },
    { val: '', fs: false }
  ],
  times: 60,
  timer: <any>{},
  phoneStar: phoneStar(<string>localStorage.getItem('mobile')),
  userMobile: <string>localStorage.getItem('mobile')
})

watchEffect(() => {
  if (props.initDialog) {
    state.list = [
      { val: '', fs: false },
      { val: '', fs: false },
      { val: '', fs: false },
      { val: '', fs: false },
      { val: '', fs: false },
      { val: '', fs: false }
    ]
  }
})

// 当输入框的内容改变时的操作
const onInput = (e: any, i: number) => {
  // 输入完成时，跳到下一个输入框(得到焦点)
  if (i < state.list.length - 1 && e.target.value) {
    // 如果下一个输入框有值，则不跳
    if (!state.list[i + 1].val) onFocus(i + 1)
  }

  // 删除时，跳到上一个输入框
  if (i && !e.target.value) {
    onFocus(i - 1)
  }
}

// 得到焦点 激活下边框样式
const onFocus = (i: number) => {
  state.list[i].fs = true
  nextTick(() => {
    codeInputRefs.value[i]?.focus()
  })
}

// 失去焦点 去除下边框样式
const onBlur = (i: number) => {
  state.list[i].fs = false
  emit('getWritoffCode', state.list)
}

/**
 * 获取短信验证码
 */
const handleGetMessage = async () => {
  try {
    await Passport.sendPinCode(state.userMobile, 3)
    ElMessage.success('验证码发送成功')
    codeInputRefs.value[0].fs = true
    nextTick(() => {
      codeInputRefs.value[0]?.focus()
    })
    state.timer = await setInterval(() => {
      state.times--
      if (state.times === 0) {
        clearInterval(state.timer)
        state.times = 60
      }
    }, 1000)
  } catch (error) {}
}
</script>

<style lang="scss" scoped>
.dialog-content {
  width: 320px;
  margin: 0 auto;
  margin-top: -30px;
  .hint {
    color: #6e6e6e;
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    .code {
      color: #3c7dff;
      cursor: pointer;
    }
  }
  .code-input {
    width: 100%;
    min-width: 100%;
    margin: 20px auto;
    input {
      width: 44px;
      height: 44px;
      font-size: 32px;
      text-align: center;
      border-radius: 2px;
      box-sizing: border-box;
      border: 1px solid #f8f8f8;
      background-color: #f8f8f8;
    }
    input.focus {
      outline: none;
      background-color: #fff;
      border: 1px solid #3c7dff;
    }
  }
}
</style>
