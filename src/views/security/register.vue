<template>
  <div class="register flex flex-column flex-center flex-only-center">
    <div class="top flex flex-only-center">
      <div class="title">欢迎注册灰鲸·禹迹</div>
      <div class="to-login">
        <span>已有灰鲸·禹迹账号？</span>
        <span class="link" @click="toLogin">去登录</span>
      </div>
    </div>
    <el-form
      ref="registerForm"
      :model="state.registerForm"
      status-icon
      :rules="state.registerRules"
      style="width: 427px"
    >
      <el-form-item prop="passportNo" style="margin-bottom: 34px">
        <el-input
          v-model="state.registerForm.passportNo"
          style="width: 100%"
          type="number"
          autocomplete="off"
          placeholder="请输入手机号"
          oninput="if(value.length>11)value=value.slice(0,11)"
        ></el-input>
      </el-form-item>
      <el-form-item prop="pinCode" style="margin-bottom: 34px">
        <div class="flex flex-only-center">
          <el-input
            v-model="state.registerForm.pinCode"
            style="width: 100%"
            type="input"
            autocomplete="off"
            placeholder="请输入短信验证码"
          ></el-input>
          <Timer
            :passport-no="state.registerForm.passportNo"
            :message-disabled="state.messageDisabled"
            @message-disabled="handleGetMessageDisabled"
          />
        </div>
      </el-form-item>
      <el-form-item prop="password" style="margin-bottom: 34px">
        <el-input
          v-model="state.registerForm.password"
          style="width: 100%"
          type="password"
          autocomplete="off"
          show-password
          placeholder="密码长度6-16字符，数字和字母的组合"
        ></el-input>
      </el-form-item>
      <el-form-item prop="verifyPassword">
        <el-input
          v-model="state.registerForm.verifyPassword"
          type="password"
          autocomplete="off"
          show-password
          placeholder="请再次输入登录密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="submit-btn" type="primary" @click="handleRegister">同意并注册</el-button>
      </el-form-item>
    </el-form>
    <div class="agreement">
      <el-checkbox v-model="state.agreement">
        <span>我已阅读并同意</span>
        <a target="_blank" href="/register/services" class="clause">《灰鲸智航服务条款》</a>
        <span style="color: #d9d9d9">｜</span>
        <a target="_blank" href="/register/privacy" class="clause">《法律声明和隐私协议政策》</a>
      </el-checkbox>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue-demi'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import { Passport, IResAccountSignInfo, IReqAccountSignUp } from '@gwin/platform-passport-pc'
import { Response } from '@gwin/networking'

import Timer from '@/components/Timer/index.vue'

import { getUrlParam } from '@/utils/index'
import config from '@/config'

interface ruleFormParam {
  value: any
}

const registerForm: ruleFormParam = ref('')

/**
 * 验证获取短信验证码
 */
const validateMessage = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请填写手机号码'))
    state.messageDisabled = true
  }
  const reg = /^[1][3,4,5,7,8,9][0-9]{9}$/
  if (reg.test(value)) {
    if (state.meassageTimes > 0) {
      state.messageDisabled = true
    } else {
      state.messageDisabled = false
    }
    callback()
  } else {
    callback(new Error('请填写正确的手机号码'))
    state.messageDisabled = true
  }
}

/**
 * 验证短信验证码
 */
const validatorCode = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请输入短信验证码'))
  }
  const reg = /^\d{4,6}$/
  if (!reg.test(value)) {
    callback(new Error('请输入正确的验证码'))
  } else {
    callback()
  }
}

/**
 * 验证密码
 */
const validatePass = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  }
  const regPwd = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
  if (!regPwd.test(value)) {
    callback(new Error('请输入6-16位的数字和字母的组合'))
  } else {
    callback()
  }
}

/**
 * 验证再次输入密码
 */
const validatecheckPass = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== state.registerForm.password) {
    callback(new Error('两次输入密码不一致，请重新输入'))
  } else {
    callback()
  }
}

const router = useRouter()

const state = reactive({
  registerForm: {
    // 短信登录
    passportNo: '',
    pinCode: '',
    password: '',
    verifyPassword: ''
  },
  registerRules: {
    // 短信登录 验证规则
    passportNo: [{ required: true, validator: validateMessage, trigger: 'change' }],
    pinCode: [{ required: true, validator: validatorCode, trigger: 'change' }],
    password: [{ required: true, validator: validatePass, trigger: 'change' }],
    verifyPassword: [{ required: true, validator: validatecheckPass, trigger: 'change' }]
  },
  messageDisabled: true,
  agreement: false, // 已阅读并同意
  meassageTimes: 0 // 短信倒计时时间
})

/**
 * 获取短信验证码 disabled状态
 */
const handleGetMessageDisabled = (val: boolean, times: number) => {
  state.messageDisabled = val
  state.meassageTimes = times
}

/**
 * 去登录
 */
const toLogin = () => {
  router.push({
    path: '/login',
    query: { callback: getUrlParam('callback') }
  })
}

/**
 * 注册
 */
const handleRegister = async () => {
  if (!registerForm.value) return
  await registerForm.value.validate((valid: any) => {
    if (valid) {
      if (!state.agreement) {
        ElMessage.warning({
          message: '请先同意《灰鲸·禹迹服务条款》《法律声明和隐私协议政策》',
          type: 'warning'
        })
        return
      }
      onRegister()
    }
  })
}

/**
 * 注册
 */
async function onRegister() {
  try {
    const account: IReqAccountSignUp = Object.assign({ passportType: 'mobile' }, state.registerForm)
    const signInfo: Response<IResAccountSignInfo> = await Passport.reginster(account)
    ElMessage.success('注册成功')
    // 跳转
    window.location.href = getUrlParam('callback') || config.GWIN_URL_WORK
    // 友盟统计 统计点击事件
    ;(window as any).setUmeng('注册页面', '用户注册', '同意并注册btn')
  } catch (error) {}
}
</script>

<style lang="scss" scoped>
.register {
  width: 90%;
  min-width: 600px;
  margin: 50px auto;
  height: calc(100vh - 210px);
  min-height: 550px;
  background-color: #fff;
  .top {
    margin-bottom: 40px;
    .title {
      width: 427px;
      color: #121212;
      font-size: 26px;
      font-weight: 600;
      text-align: center;
      margin-left: 150px;
    }
    .to-login {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      .link {
        color: #3c7dff;
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }

  .submit-btn {
    width: 100%;
    height: 44px;
    font-size: 16px;
    margin-top: 20px;
    background: #3c7dff;
    &:hover {
      box-shadow: 0px 2px 4px 0px rgba(39, 123, 255, 0.5);
    }
  }
  .agreement {
    color: #6e6e6e;
    font-size: 12px;
    .clause {
      color: #3c7dff;
    }
  }
}
</style>
