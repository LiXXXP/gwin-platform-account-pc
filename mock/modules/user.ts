import { MockMethod } from 'vite-plugin-mock'

const userMock: MockMethod[] = [
  // user user
  {
    url: '/user/user',
    method: 'post',
    response: {
      code: 1,
      message: 'SUCCESS',
      data: {
        userId: 1,
        userName: 'admin',
        token: '12345678901234567890'
      }
    }
  },

  // get user info
  {
    url: '/user/info',
    method: 'post',
    response: {
      code: 1,
      message: 'SUCCESS',
      data: {
        userId: 1,
        userName: 'admin'
      }
    }
  },

  // user logout
  {
    url: '/user/logout',
    method: 'post',
    response: {
      code: 1,
      message: 'SUCCESS',
      data: {}
    }
  }
]

export default userMock
