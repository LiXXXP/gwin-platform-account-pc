import { Request, Response } from '@gwin/networking'
export class InvitedApi {
  // 用户受邀信息查询
  async AccountInvitedInquiry(params: object): Promise<Response> {
    const request = new Request({
      url: '/cif/v1/AccountInvitedInquiry',
      params: params,
      isLoading: true,
      isMessage: true
    })
    return await request.start()
  }

  // 用户加入企业
  async AccountInvitedAddition(params: object): Promise<Response> {
    const request = new Request({
      url: '/cif/v1/AccountInvitedAddition',
      params: params,
      isLoading: true,
      isMessage: true,
      isError: true
    })
    return await request.start()
  }
}

export default new InvitedApi()
