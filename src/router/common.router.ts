import Common from '@/common/index.vue'
import { RouteConfig } from '#/global'

const commonRoutes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/views/security/login.vue'),
    meta: { title: '登录' },
    hidden: true
  },
  {
    path: '/register',
    component: Common,
    name: 'Register',
    redirect: '/register/account',
    children: [
      {
        path: 'account',
        component: () => import('@/views/security/register.vue'),
        meta: { title: '注册' }
      },
      {
        path: 'invite',
        component: () => import('@/views/join/invite.vue'),
        meta: { title: '邀请' }
      },
      {
        path: 'forget',
        component: () => import('@/views/security/forget.vue'),
        meta: { title: '忘记密码' }
      },
      {
        path: 'privacy',
        component: () => import('@/views/security/privacy.vue'),
        meta: { title: '法律声明和隐私协议政策' }
      },
      {
        path: 'services',
        component: () => import('@/views/security/services.vue'),
        meta: { title: '灰鲸·禹迹服务条款' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    hidden: true
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/error/403.vue')
  }
]

export default commonRoutes
