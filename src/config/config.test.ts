import { Config } from './interface'

const config: Config = {
  GWIN_URL_ACCOUNT_403: '//test-account-console.cdgwin.com/403',
  GWIN_URL_NOPERMISSION: '//test-tenant-console.cdgwin.com/tenant/noentry',
  GWIN_URL_HOME: '//test.cdgwin.com',
  GWIN_URL_WORK: '//test-work-console.cdgwin.com/console/index',
  GWIN_URL_TENANT: '//test-tenant-console.cdgwin.com/tenant/index',
  GWIN_URL_LOGIN: '//test-account-console.cdgwin.com/login?callback=' + window.location,
  GWIN_URL_REGISTER: '//test-account-console.cdgwin.com/register',
  GWIN_URL_UMENG: 'https://s4.cnzz.com/z_stat.php?id=1280894963&web_id=1280894963'
}

export default config
