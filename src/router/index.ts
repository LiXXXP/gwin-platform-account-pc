import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import appRoutes from './app.router'
import commonRoutes from './common.router'
import { getUserId } from '@/utils/auth'
import { setTitle } from '@/utils/index'
import { getPageTitle } from '@/utils/get-page-title'
import config from '../config'

const routes: Array<RouteRecordRaw> = [...commonRoutes, ...appRoutes]

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

router.beforeEach((to: any, from, next) => {
  /* 设置title */
  if (to.meta.title) {
    const title = getPageTitle(to.meta.title)
    setTitle(title)
  }

  if (getUserId()) {
    if (to.path === '/login') {
      window.location.href = config.GWIN_URL_WORK
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
