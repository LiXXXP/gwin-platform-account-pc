<template>
  <div class="information">
    <div class="basic">
      <div class="title">基本信息</div>
      <div class="flex flex-only-center">
        <svg class="svg-icon icon name" aria-hidden="true">
          <use xlink:href="#icon-gwin-default-portrait" />
        </svg>
        <div class="info">
          <p>
            <span class="item">登录账号：</span>
            <span>{{ state.basicInfo.mobile }}</span>
          </p>
          <p>
            <span class="item">账号ID：</span>
            <span>{{ state.basicInfo.id }}</span>
          </p>
          <p>
            <span class="item">注册时间：</span>
            <span>{{ formatDate(state.basicInfo.registTime) }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="contact">
      <div class="hint flex flex-only-center">
        <i class="hint-icon"></i>
        <p>基本资料以实名信息为准，以下信息仅供参考，填写以下信息方便我们更好为您服务</p>
      </div>
      <div class="title">联系信息</div>
      <el-form
        ref="ruleForm"
        :model="state.ruleForm"
        :rules="state.rules"
        label-width="100px"
        label-position="left"
        style="width: 520px"
      >
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="state.ruleForm.name" clearable placeholder="请输入姓名" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="state.ruleForm.email" clearable placeholder="请输入邮箱" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="国家地区：" prop="country">
          <div>{{ state.ruleForm.country }}</div>
        </el-form-item>
        <el-form-item label="所在地：" prop="region">
          <el-cascader
            v-model="state.ruleForm.region"
            style="width: 100%"
            placeholder="请选择地区"
            :options="state.regionList"
            :props="state.props"
            @change="handleChangeRegion"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="街道地址：" prop="address">
          <el-input v-model="state.ruleForm.address" clearable placeholder="请输入地址" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="submit-btn" @click="handleSave">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue-demi'
import { Passport, IResUserBasicInfo } from '@gwin/platform-passport-pc'
import { Response } from '@gwin/networking'
import { ElMessage } from 'element-plus'
import UserBasicApi from '@/api/userBasic'
import { getUserId } from '@/utils/auth'
import { formatDate } from '@/utils/index'
import regionList from '@/options/region-list-inquiry'

interface ruleFormParam {
  value: any
}

const ruleForm: ruleFormParam = ref('')

/**
 * 街道地址验证
 */
const validatorCode = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请输入街道地址'))
  }
  console.log(value.length)
  if (value.length >= 100) {
    callback(new Error('请输入不得超过100字的街道地址'))
  } else {
    callback()
  }
}

// 邮箱验证
const validatorEmail = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请输入邮箱地址'))
  }
  const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
  if (!reg.test(value)) {
    callback(new Error('请输入正确的邮箱地址'))
  } else {
    callback()
  }
}

const state = reactive({
  ruleForm: {
    name: '',
    email: '',
    country: '中国',
    region: <any>[],
    address: ''
  },
  rules: {
    email: [{ required: true, validator: validatorEmail, trigger: 'change' }],
    name: [{ required: true, message: '请输入姓名', trigger: 'change' }],
    country: [{ required: true, trigger: 'blur' }],
    region: [{ required: true, message: '请输入街道地址', trigger: 'change' }],
    address: [{ required: true, validator: validatorCode, trigger: 'change' }]
  },
  basicInfo: <any>{}, // 个人信息
  props: {
    // hover 行业多级联选
    expandTrigger: 'hover'
  },
  regionList: regionList // 地区列表
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
    state.ruleForm.name = response.body.name
    state.ruleForm.email = response.body.email
    state.ruleForm.address = response.body.address
    state.ruleForm.region = [response.body.province, response.body.city, response.body.district]
  } catch (error) {}
}

/**
 * 获取 地区列表 所选中的值
 */
const handleChangeRegion = (value: any) => {
  state.ruleForm.region = value
}

/**
 * 保存
 */
const handleSave = () => {
  if (!ruleForm.value) return
  ruleForm.value.validate(async (valid: any) => {
    if (valid) {
      const param = {
        accountId: getUserId(),
        address: state.ruleForm.address,
        name: state.ruleForm.name,
        email: state.ruleForm.email,
        country: state.ruleForm.country,
        province: state.ruleForm.region[0], // 省
        city: state.ruleForm.region[1], // 市
        district: state.ruleForm.region[2] // 区
      }
      const res = await UserBasicApi.AccountMaintenance(param)
      if (res.status.success) {
        ElMessage.success('保存成功')
        getBasicInfo()
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.information {
  .title {
    color: #121212;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 20px;
    &::before {
      content: '';
      width: 4px;
      height: 18px;
      margin-right: 6px;
      display: inline-block;
      vertical-align: text-bottom;
      background-color: #3c7dff;
    }
  }
  .basic {
    width: 100%;
    height: 200px;
    padding: 30px;
    box-sizing: border-box;
    background-color: #fff;
    .name {
      width: 88px;
      height: 88px;
      margin-right: 30px;
      border-radius: 100%;
    }
    .info {
      color: #121212;
      font-size: 14px;
      p {
        margin-top: 10px;
        .item {
          min-width: 70px;
          color: #999;
          margin-right: 20px;
          display: inline-block;
        }
      }
    }
  }
  .contact {
    width: 100%;
    height: calc(100vh - 320px);
    min-height: 420px;
    padding: 30px;
    margin-top: 20px;
    box-sizing: border-box;
    background-color: #fff;
    .hint {
      width: 100%;
      height: 40px;
      min-width: 670px;
      color: #121212;
      font-size: 14px;
      line-height: 40px;
      border-radius: 2px;
      margin-bottom: 30px;
      box-sizing: border-box;
      border: 1px solid #3c7dff;
      background: rgba(60, 125, 255, 0.08);
      .hint-icon {
        width: 20px;
        height: 20px;
        display: block;
        margin-left: 10px;
        margin-right: 8px;
        background: url('../../assets/imgs/hint.png') no-repeat 0 0;
        background-size: 100%;
      }
    }
    .submit-btn {
      width: 132px;
      height: 44px;
      background: #3c7dff;
      border-radius: 4px;
    }
  }
}
</style>
