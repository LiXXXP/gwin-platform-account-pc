<template>
  <div class="login flex">
    <img class="lf-logo" src="../../assets/imgs/lf-logo.png" alt="" @click="goUrl('http://cdgwin.com/')" />
    <div class="left flex flex-center flex-only-center">
      <div class="text"></div>
    </div>
    <div class="right flex flex-column flex-center flex-only-center">
      <div class="login-tab flex flex-center">
        <div
          v-for="(item, index) in state.tabs"
          :key="item.id"
          :class="{ active: index === state.currentIndex }"
          @click="handleTabSwitch(index)"
        >
          {{ item.tabName }}
        </div>
      </div>
      <div v-if="state.currentIndex === 0">
        <div v-if="state.errorInfo.captchaCode" class="error flex flex-only-center">
          <i class="error-icon"></i>
          <p>{{ state.errorInfo.errMsg }}</p>
        </div>
        <el-form
          ref="accountForm"
          :model="state.accountForm"
          status-icon
          :rules="state.accountRules"
          style="width: 420px"
        >
          <el-form-item prop="passportNo">
            <el-input
              v-model="state.accountForm.passportNo"
              style="width: 100%"
              type="number"
              maxlength="11"
              autocomplete="off"
              placeholder="请输入手机号"
              oninput="if(value.length>11)value=value.slice(0,11)"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="state.accountForm.password"
              style="width: 100%"
              type="password"
              autocomplete="off"
              show-password
              placeholder="请输入密码"
              @keyup.enter="handleAccountLogin"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="state.errorInfo.captchaCode" prop="captchaCode">
            <div class="flex flex-between flex-only-center">
              <el-input
                v-model="state.accountForm.captchaCode"
                style="width: 100%"
                type="input"
                autocomplete="off"
                placeholder="请输入验证码"
                @keyup.enter="handleAccountLogin"
              ></el-input>
              <div class="code" @click="onGetCaptchaCodeButtonClick">
                <img :src="state.errorInfo.captchaCode" />
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button class="submit-btn" type="primary" @click="handleAccountLogin">登录</el-button>
          </el-form-item>
          <el-form-item>
            <div class="flex flex-between">
              <div class="forget" @click="onRegister">立即注册</div>
              <router-link to="/register/forget" class="forget">忘记密码</router-link>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="state.currentIndex === 1">
        <div v-if="state.errorInfo.captchaCode" class="error flex flex-only-center">
          <i class="error-icon"></i>
          <p>{{ state.errorInfo.errMsg }}</p>
          <el-form
            ref="messageForm"
            :model="state.messageForm"
            status-icon
            :rules="state.messageRules"
            style="width: 420px"
          >
            <el-form-item prop="passportNo">
              <el-input
                v-model="state.messageForm.passportNo"
                style="width: 100%"
                type="number"
                maxlength="11"
                autocomplete="off"
                placeholder="请输入手机号"
                oninput="if(value.length>11)value=value.slice(0,11)"
              ></el-input>
            </el-form-item>
            <el-form-item prop="pinCode">
              <div class="flex flex-only-center">
                <el-input
                  v-model="state.accountForm.password"
                  style="width: 100%"
                  type="password"
                  autocomplete="off"
                  show-password
                  placeholder="请输入密码"
                  @keyup.enter="handleAccountLogin"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item v-if="state.errorInfo.captchaCode" prop="captchaCode">
              <div class="flex flex-between flex-only-center">
                <el-input
                  v-model="state.accountForm.captchaCode"
                  style="width: 100%"
                  type="input"
                  autocomplete="off"
                  placeholder="请输入验证码"
                  @keyup.enter="handleAccountLogin"
                ></el-input>
                <div class="code" @click="onGetCaptchaCodeButtonClick">
                  <img :src="state.errorInfo.captchaCode" />
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button class="submit-btn" type="primary" @click="handleAccountLogin">登录</el-button>
            </el-form-item>
            <el-form-item>
              <div class="flex flex-between">
                <div class="forget" @click="onRegister">立即注册</div>
                <router-link to="/register/forget" class="forget">忘记密码</router-link>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="state.currentIndex === 1">
          <div v-if="state.errorInfo.captchaCode" class="error flex flex-only-center">
            <i class="error-icon"></i>
            <p>{{ state.errorInfo.errMsg }}</p>
          </div>
          <el-form
            ref="messageForm"
            :model="state.messageForm"
            status-icon
            :rules="state.messageRules"
            style="width: 320px"
          >
            <el-form-item prop="passportNo">
              <el-input
                v-model="state.messageForm.passportNo"
                style="width: 100%"
                type="number"
                maxlength="11"
                autocomplete="off"
                placeholder="请输入手机号"
                oninput="if(value.length>11)value=value.slice(0,11)"
              ></el-input>
            </el-form-item>
            <el-form-item prop="pinCode">
              <div class="flex flex-only-center">
                <el-input
                  v-model="state.messageForm.pinCode"
                  style="width: 100%"
                  type="input"
                  autocomplete="off"
                  placeholder="请输入短信验证码"
                  @keyup.enter="handleMessageLogin"
                ></el-input>
                <Timer
                  :type="2"
                  :passport-no="state.messageForm.passportNo"
                  :message-disabled="state.messageDisabled"
                  @message-disabled="handleGetMessageDisabled"
                />
              </div>
            </el-form-item>
            <el-form-item v-if="state.errorInfo.captchaCode" prop="captchaCode">
              <div class="flex flex-between flex-only-center">
                <el-input
                  v-model="state.messageForm.captchaCode"
                  style="width: 100%"
                  type="input"
                  autocomplete="off"
                  placeholder="请输入验证码"
                  @keyup.enter="handleMessageLogin"
                ></el-input>
                <div class="code" @click="onGetCaptchaCodeButtonClick">
                  <img :src="state.errorInfo.captchaCode" />
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button class="submit-btn" type="primary" @click="handleMessageLogin">登录</el-button>
            </el-form-item>
            <el-form-item>
              <div class="forget" @click="onRegister">立即注册</div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue-demi'

import { IReqAccountSignIn, Passport, IResCaptchaCode, IResAccountSignInfo } from '@gwin/platform-passport-pc'
import { Response } from '@gwin/networking'
import { ElMessage } from 'element-plus'

import { getUrlParam } from '@/utils/index'

import Timer from '@/components/Timer/index.vue'
import router from '@/router'
import config from '@/config'

interface ruleFormParam {
  value: any
}

interface errorMsgParam {
  captchaCode: string
  errMsg: unknown
}

const accountForm: ruleFormParam = ref('')
const messageForm: ruleFormParam = ref('')

const goUrl = (url: string) => {
  location.href = url
}

/**
 * 验证密码
 */
const validatePass = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请填写登录密码'))
  }
  const regPwd = /^[^\u4e00-\u9fa5 ]{6,16}$/
  if (!regPwd.test(value)) {
    callback(new Error('请输入6-16位的数字和字母的组合'))
  } else {
    callback()
  }
}

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

const state = reactive({
  tabs: [
    // tab
    {
      id: 1,
      tabName: '密码登录'
    },
    {
      id: 2,
      tabName: '短信登录'
    }
  ],
  currentIndex: 0, // tab 当前index 0: 账号登录，1: 短信登录
  accountForm: {
    // 账号登录
    passportNo: '',
    password: '',
    captchaCode: '',
    captchaCodeId: ''
  },
  accountRules: {
    // 账号登录 验证规则
    passportNo: [
      { required: true, message: '请填写手机号码', trigger: 'change' },
      { pattern: /^[1][3,4,5,7,8,9][0-9]{9}$/, message: '请填写正确的手机号码' }
    ],
    password: [{ required: true, validator: validatePass, trigger: 'change' }],
    captchaCode: [
      { required: true, message: '请填写验证码', rigger: 'blur' },
      { pattern: /^[^\u4e00-\u9fa5 ]{0,4}$/, message: '请输入正确的验证码' }
    ]
  },
  messageForm: {
    // 短信登录
    passportNo: '',
    pinCode: '',
    captchaCode: '',
    captchaCodeId: ''
  },
  messageRules: {
    // 短信登录 验证规则
    passportNo: [{ required: true, validator: validateMessage, trigger: 'change' }],
    pinCode: [{ required: true, validator: validatorCode, trigger: 'change' }],
    captchaCode: [
      { required: true, message: '请填写验证码', rigger: 'blur' },
      { pattern: /^[^\u4e00-\u9fa5 ]{0,4}$/, message: '请填写正确的验证码' }
    ]
  },
  messageDisabled: true,
  meassageTimes: 0, // 短信倒计时时间
  errorInfo: <errorMsgParam>{} // 错误信息
})

/**
 * 密码 短信 登录切换
 */
const handleTabSwitch = (index: number) => {
  state.currentIndex = index
  state.errorInfo.captchaCode = ''
  state.accountForm.captchaCode = ''
  state.accountForm.captchaCodeId = ''
  state.messageForm.captchaCode = ''
  state.messageForm.captchaCodeId = ''
}

/**
 * 账号密码登录
 */
const handleAccountLogin = () => {
  if (!accountForm.value) return
  accountForm.value.validate(async (valid: boolean) => {
    if (valid) {
      await onLogin('password', state.accountForm)
    }
  })
}

/**
 * 获取短信验证码 disabled状态
 */
const handleGetMessageDisabled = (val: boolean, times: number) => {
  state.messageDisabled = val
  state.meassageTimes = times
}

/**
 * 短信登录
 */
const handleMessageLogin = () => {
  if (!messageForm.value) return
  messageForm.value.validate(async (valid: boolean) => {
    if (valid) {
      await onLogin('pinCode', state.messageForm)
    }
  })
}

/**
 * 登录 请求
 */
async function onLogin(signType: string, formData: any) {
  try {
    const account: IReqAccountSignIn = Object.assign(
      {
        passportType: 'mobile',
        signType: signType
      },
      formData
    )
    const signInfo: Response<IResAccountSignInfo> = await Passport.login(account)
    ElMessage.success('登录成功')
    // 跳转
    if (signInfo.body.subjectId) {
      window.location.href = <string>getUrlParam('callback') || config.GWIN_URL_WORK
    } else {
      window.location.href = config.GWIN_URL_TENANT
    }
    // 友盟统计 统计点击事件
    ;(window as any).setUmeng('登录页面', '用户登录', '登录btn')
  } catch (error: any) {
    // 显示 账号密码错误 及 验证码
    // 获取图形验证码
    state.errorInfo.errMsg = error.message
    onGetCaptchaCodeButtonClick()
  }
}

/**
 * 获取图形验证码
 */
const onGetCaptchaCodeButtonClick = async () => {
  const response: Response<IResCaptchaCode> = await Passport.getCaptchaCode()
  state.errorInfo.captchaCode = response.body.captchaCode
  if (state.currentIndex === 0) {
    state.accountForm.captchaCodeId = response.body.captchaCodeId
  } else {
    state.messageForm.captchaCodeId = response.body.captchaCodeId
  }
}

/**
 * 立即注册
 */
const onRegister = () => {
  // 友盟统计 统计点击事件
  ;(window as any).setUmeng('登录页面', '用户登录', '立即注册btn')
  const url = <string>getUrlParam('callback')
  if (url && url.includes('userInviteId')) {
    router.push({
      path: '/register/account',
      query: { callback: getUrlParam('callback') }
    })
    return
  }
  router.push('/register/account')
}
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100vh;

  overflow: auto;
  .left,
  .right {
    width: 60%;
    height: 100vh;
    min-width: 558px;
    min-height: 750px;
  }
  .lf-logo {
    width: 170px;
    height: 36px;
    position: absolute;
    left: 20px;
    top: 20px;
    cursor: pointer;
  }
  .left {
    background: url('../../assets/imgs/login-bk.png') no-repeat;
    background-size: 100% 100%;
    min-width: 720px;
    min-height: 750px;
    .text {
      width: 400px;
      height: 440px;
      background: url('../../assets/imgs/login-text.png') no-repeat;
      background-size: cover;
      position: absolute;
      bottom: 20%;
    }
  }
  .right {
    position: relative;
    background: #ffffff;
    border-radius: 5px;

    .login-tab {
      color: #adadad;
      font-size: 18px;
      margin-bottom: 50px;
      border-bottom: 1px solid #f5f5f5;
      width: 200px;
      display: flex;
      justify-content: space-between;
      div {
        cursor: pointer;
        padding-bottom: 8px;
        border-bottom: 2px solid transparent;
        &.active {
          color: #121212;
          font-weight: 500;
          font-size: 20px;
          border-bottom: 2px solid #121212;
        }
      }
    }
    .error {
      width: 320px;
      padding: 5px 10px;
      margin-bottom: 20px;
      box-sizing: border-box;
      border: 1px solid rgba(245, 34, 45, 0.3);
      background-color: rgba(245, 34, 45, 0.08);
      .error-icon {
        width: 20px;
        height: 20px;
        margin-right: 8px;
        background: url('../../assets/imgs/error.png') no-repeat 0 0;
        background-size: 100%;
      }
      p {
        color: #6e6e6e;
        font-size: 14px;
      }
    }
    .code {
      width: 180px;
      height: 40px;
      cursor: pointer;
      margin-left: 16px;
      border-radius: 4px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .forget {
      display: block;
      cursor: pointer;
      line-height: 14px;
      color: #999;
      &:hover {
        color: #3860f4;
      }
    }
    .submit-btn {
      width: 100%;
      font-size: 16px;
      background: #3860f4;
      &:hover {
        box-shadow: 0px 2px 4px 0px rgba(39, 123, 255, 0.5);
      }
    }
  }
}
</style>
