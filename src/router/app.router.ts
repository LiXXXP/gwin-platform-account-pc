import Layout from '@/layout/index.vue'
import { RouteConfig } from '#/global'

const appRoutes: Array<RouteConfig> = [
  {
    path: '/account',
    component: Layout,
    name: 'Account',
    redirect: '/account/information',
    children: [
      {
        path: 'information',
        name: 'Information',
        component: () => import('@/views/account/information.vue'),
        meta: {
          title: '基本信息',
          requireAuth: true // 需要登录
        }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/account/settings.vue'),
        meta: {
          title: '安全设置',
          requireAuth: true // 需要登录
        }
      },
      {
        path: 'changePassword',
        name: 'changePassword',
        component: () => import('@/views/account/changePassword.vue'),
        meta: {
          title: '修改密码',
          requireAuth: true // 需要登录
        }
      },
      {
        path: 'changeMobile',
        name: 'changeMobile',
        component: () => import('@/views/account/changeMobile.vue'),
        meta: {
          title: '修改手机号',
          requireAuth: true // 需要登录
        }
      }
    ]
  }
]

export default appRoutes
