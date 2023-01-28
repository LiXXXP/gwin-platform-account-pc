<template>
  <div class="invite flex flex-column flex-center flex-only-center">
    <div class="title">
      <p>Hi，{{ state.userBasic.name }}</p>
      <p>邀请你加入「 {{ state.invitedName }} 」</p>
    </div>
    <div class="user flex flex-center flex-only-center">
      <svg class="svg-icon icon head" aria-hidden="true">
        <use xlink:href="#icon-gwin-default-portrait" />
      </svg>
      <p class="name">{{ state.userBasic.mobile }}</p>
    </div>
    <el-button class="join" type="primary" @click="handleJoinTeam">加入企业</el-button>
    <el-button class="other" plain @click="handleOtherLogin">使用其他账号</el-button>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue-demi'

import { Passport, IResUserBasicInfo, IResAccountSignInfo } from '@gwin/platform-passport-pc'
import { Response } from '@gwin/networking'

import { getUrlParam } from '@/utils/index'
import { getUserId } from '@/utils/auth'
import InvitedApi from '@/api/invited'
import config from '@/config'

interface userBasicParam {
  name: string
  mobile: string
}

const state = reactive({
  userInviteId: getUrlParam('userInviteId'),
  invitedName: '', // 企业名称
  invitedId: '', // 企业id
  userBasic: <userBasicParam>{}, // 个人信息
  userHead: ''
})

onMounted(() => {
  // 用户受邀信息查询
  getAccountInvitedInquiry()
  // 个人信息查询
  getUserBasicInfoInquiry()
})

/**
 * 用户受邀信息查询
 */
const getAccountInvitedInquiry = async () => {
  const param = {
    userInviteId: state.userInviteId
  }
  const res = await InvitedApi.AccountInvitedInquiry(param)
  state.invitedName = res.body.name
  state.invitedId = res.body.id
}

/**
 * 个人信息查询
 */
const getUserBasicInfoInquiry = async () => {
  const response: Response<IResUserBasicInfo> = await Passport.getUserBasicInfo()
  state.userBasic = response.body
  state.userHead = response.body.name.substr(0, 1)
}

/**
 * 进入企业
 */
const handleJoinTeam = async () => {
  try {
    const param = {
      userId: getUserId(),
      userInviteId: state.userInviteId
    }
    await InvitedApi.AccountInvitedAddition(param)
    // 设置 ENTITY_ID_KEY
    const signInfo: IResAccountSignInfo = Passport.localUserSignInfo()
    signInfo.subjectId = state.invitedId
    signInfo.subjectName = state.invitedName
    Passport.updateSignInfo(signInfo)
    // 跳转 工作台首页
    window.location.href = config.GWIN_URL_WORK
  } catch (error: any) {
    setTimeout(() => {
      window.location.href = config.GWIN_URL_TENANT
    }, 3000)
  }
}

/**
 * 使用其他账号
 */
const handleOtherLogin = () => {
  // 退出 跳转登录页面
  Passport.logout()
}
</script>

<style lang="scss" scoped>
.invite {
  .title {
    color: #121212;
    font-size: 34px;
    font-weight: 500;
    text-align: center;
    line-height: 60px;
  }
  .user {
    width: 427px;
    height: 117px;
    margin-top: 67px;
    margin-bottom: 27px;
    background-color: #f8f8f8;
    .head {
      width: 77px;
      height: 77px;
      margin-right: 27px;
      border-radius: 100%;
    }
    .name {
      color: #121212;
      font-size: 24px;
    }
  }
  .join {
    margin: 0;
    width: 427px;
    height: 59px;
    display: block;
    font-size: 20px;
    border-radius: 5px;
    background: #3c7dff;
    box-shadow: 0px 3px 5px 0px rgba(39, 123, 255, 0.5);
  }
  .other {
    margin: 0;
    width: 427px;
    height: 59px;
    display: block;
    font-size: 20px;
    color: #3c7dff;
    margin-top: 27px;
    border-radius: 5px;
    background: #ffffff;
    border: 2px solid #3c7dff;
  }
}
</style>
