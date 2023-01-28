<template>
  <div class="settings">
    <div class="changed">
      <div class="block flex flex-between flex-only-center">
        <div>
          <div class="flex flex-only-center">
            <i class="complete-icon"></i>
            <p class="title">登录密码</p>
          </div>
          <div class="describe">
            安全性高的密码可以使账号更安全，建议您定期更换密码，密码长度6-20字符,支持字母,数字以及标点符号(中文，空格除外)
          </div>
        </div>
        <div class="text" @click="handleToPassword">修改</div>
      </div>
      <div class="block flex flex-between flex-only-center">
        <div>
          <div class="flex flex-only-center">
            <i class="complete-icon"></i>
            <p class="title">手机绑定</p>
          </div>
          <div class="describe">您已绑定了手机 {{ state.basicInfo.mobile }}</div>
        </div>
        <div class="text" @click="handleToMobile">修改</div>
      </div>
      <div class="block flex flex-between flex-only-center">
        <div>
          <div class="flex flex-only-center">
            <i class="complete-icon"></i>
            <p class="title">登录保持时间</p>
          </div>
          <div class="describe">
            您可以设置保持登录的时间长度（大于等于小时，小于等于12小时），超过该时间系统会退出登录，目前的设置为3小时（系统默认是3小时）
          </div>
        </div>
        <div class="text">敬请期待</div>
      </div>
    </div>
    <div class="changed logout">
      <div class="block flex flex-between flex-only-center">
        <div>
          <div class="flex flex-only-center">
            <i class="cancellation-icon"></i>
            <p class="title">注销账号</p>
          </div>
          <div class="describe">
            如果您不再使用此账号，可以将其注销。账号成功注销后，其下所有服务、数据及隐私信息将会被删除并将无法恢复
          </div>
        </div>
        <div class="text" @click="handleWritOff">确认注销</div>
      </div>
    </div>
  </div>
  <!-- 账号注销弹窗 -->
  <el-dialog v-model="state.centerDialogVisible" width="30%" top="30vh" center custom-class="dialog-width">
    <template #title>
      <p class="dialog-title">身份验证</p>
    </template>
    <Dialog :init-dialog="state.initDialog" @get-writoff-code="getWritoffCode" />
    <template #footer>
      <span class="dialog-footer">
        <el-button class="submit-btn" type="primary" @click="handleDialogVisible">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue-demi'
import router from '@/router'

import { Passport, IResUserBasicInfo } from '@gwin/platform-passport-pc'
import { Response } from '@gwin/networking'

import { ElMessage } from 'element-plus'
import { getUserId } from '@/utils/auth'
import { phoneStar } from '@/utils/index'

import Dialog from '@/components/Dialog/index.vue'

interface basicInfoParam {
  mobile: string
}

const state = reactive({
  centerDialogVisible: false,
  basicInfo: <basicInfoParam>{},
  pinCode: '', // 短信验证码
  initDialog: false // 验证码输入框初始
})

onMounted(() => {
  getBasicInfo()
})

/**
 * 个人信息查询
 */
const getBasicInfo = async () => {
  try {
    const response: Response<IResUserBasicInfo> = await Passport.getUserBasicInfo()
    state.basicInfo = response.body
    localStorage.setItem('mobile', response.body.mobile)
    state.basicInfo.mobile = phoneStar(state.basicInfo.mobile)
  } catch (error) {}
}

/**
 * 跳转 修改密码页面
 */
const handleToPassword = () => {
  router.push('/account/changePassword')
}

/**
 * 跳转 修改手机号页面
 */
const handleToMobile = () => {
  router.push('/account/changeMobile')
}

/**
 * 注销账号 短信验证码
 */
const getWritoffCode = (val: any) => {
  let code: any = []
  for (const item of val) {
    code = [...code, ...item.val]
  }
  state.pinCode = code.join().replace(/,/g, '')
  state.initDialog = false
}

/**
 * 注销账号
 */
const handleWritOff = () => {
  state.initDialog = true
  state.centerDialogVisible = true
}

/**
 * 提交账号注销 关闭弹出层
 */
const handleDialogVisible = async () => {
  if (state.pinCode) {
    try {
      await Passport.writOff(getUserId() || '', state.pinCode, localStorage.getItem('mobile') || '')
      localStorage.clear()
      ElMessage.success('账号已注销')
      state.centerDialogVisible = false
      router.push('/login')
    } catch (error) {
      state.initDialog = true
    }
  } else {
    ElMessage.warning('请先输入手机号验证码')
  }
}
</script>

<style lang="scss" scoped>
.settings {
  .changed {
    width: 100%;
    margin-bottom: 20px;
    .block {
      padding: 20px;
      font-size: 14px;
      box-sizing: border-box;
      background-color: #fff;
      border-bottom: 1px solid #d9d9d9;
      &:last-child {
        border: 0;
      }
      .complete-icon {
        width: 20px;
        height: 20px;
        display: block;
        margin-right: 10px;
        background: url('../../assets/imgs/complete.png') no-repeat 0 0;
        background-size: 100%;
      }
      .title {
        color: #121212;
        font-size: 16px;
        font-weight: 600;
      }
      .describe {
        color: #999;
        margin-top: 10px;
        margin-left: 30px;
      }
      .text {
        color: #3c7dff;
        cursor: pointer;
      }
    }
  }
  .logout {
    .block {
      .cancellation-icon {
        width: 20px;
        height: 20px;
        display: block;
        margin-right: 10px;
        background: url('../../assets/imgs/cancellation.png') no-repeat 0 0;
        background-size: 100%;
      }
      .text {
        color: #f5222d;
      }
    }
  }
}
.dialog-title {
  font-size: 18px;
  font-weight: 600;
  color: #121212;
  margin-top: 30px;
}
.submit-btn {
  width: 320px;
  height: 44px;
  font-size: 16px;
  border-radius: 4px;
  background-color: #3c7dff;
}
:deep(.el-overlay .el-overlay-dialog) {
  top: 30%;
}
</style>
