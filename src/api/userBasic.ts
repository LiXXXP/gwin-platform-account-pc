import { Request, Response } from '@gwin/networking'

export class UserBasicApi {
  // 个人信息维护
  async AccountMaintenance(params: object): Promise<Response> {
    const request = new Request({
      url: '/cif/v1/AccountMaintenance',
      params: params,
      isLoading: true,
      isMessage: true
    })
    return await request.start()
  }
}

export default new UserBasicApi()
