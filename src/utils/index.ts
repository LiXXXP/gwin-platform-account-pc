/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time: string | number | Date, cFormat: string): string {
  if (arguments.length === 0) {
    return ''
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj: any = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time: string | number | Date, option: string): string {
  if (('' + time).length === 10) {
    time = parseInt(time as string) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d.getMilliseconds()) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url: string): any {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"').replace(/\+/g, ' ') +
      '"}'
  )
}
export function isEmpty(val: string | number | null | undefined, includeZero = false): boolean {
  return val === '' || val === null || val === undefined || (includeZero && val === 0)
}

/**
 * xss防止注入
 * @param str 字符串
 */
export function transHtml(str: string) {
  if (!str) {
    return ''
  }
  const xssList = [
    '<input',
    '<link',
    '<meta',
    '<img',
    '<bgsound',
    '<layer',
    '<base',
    '<script',
    '</script',
    '<table',
    '</table',
    '<object',
    '</object',
    '<body',
    '</body',
    '<iframe',
    '</iframe',
    '<div',
    '</div',
    '<style',
    '</style',
    '<xml',
    '</xml',
    '<h1',
    '</h1',
    '<h2',
    '</h2',
    '<h3',
    '</h3',
    '<h4',
    '</h4',
    '<h5',
    '</h5',
    '<h6',
    '</h6',
    '<span',
    '</span',
    '<textarea',
    '</textarea'
  ]
  const tempStr = str.toLowerCase()
  for (let i = 0; i < xssList.length; i++) {
    if (tempStr.indexOf(xssList[i]) !== -1) {
      str = str.replace(/</g, '&lt;')
      str = str.replace(/>/g, '&gt;')
      break
    }
  }
  return str
}

/**
 * 获取url参数
 * @param name 参数名字
 */
export function getUrlParam(name: string) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  const r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

/**
 * 时间戳格式化函数
 * @param  {int}    date 要格式化的时间 默认为当前时间
 * @return {string}           格式化的时间字符串
 */
export function formatDate(date: any) {
  const dateVal = new Date(date)
  const YY = dateVal.getFullYear() + '-'
  const MM = (dateVal.getMonth() + 1 < 10 ? '0' + (dateVal.getMonth() + 1) : dateVal.getMonth() + 1) + '-'
  const DD = dateVal.getDate() < 10 ? '0' + dateVal.getDate() : dateVal.getDate()
  const hh = (dateVal.getHours() < 10 ? '0' + dateVal.getHours() : dateVal.getHours()) + ':'
  const mm = (dateVal.getMinutes() < 10 ? '0' + dateVal.getMinutes() : dateVal.getMinutes()) + ':'
  const ss = dateVal.getSeconds() < 10 ? '0' + dateVal.getSeconds() : dateVal.getSeconds()
  return isNaN(dateVal.getFullYear()) ? '' : YY + MM + DD + ' ' + hh + mm + ss
}

/**
 * 设置title
 * @param title 参数
 */
export function setTitle(title: any) {
  return (document.title = title)
}

/**
 * 手机号掩码
 * @param phone 手机号
 */
export function phoneStar(phone: string) {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}
