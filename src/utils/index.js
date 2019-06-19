function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

function addZero (n) {
  return n > 10 ? n : '0' + n
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')
  return `${t1} ${t2}`
}

export function toast (title = '成功', icon = 'success', duration = 2000) {
  wx.showToast({
    title: title,
    icon: icon,
    duration: duration
  })
}

export function getNowFormatDate () {
  const now = new Date()
  const year = now.getFullYear()
  const month = addZero(now.getMonth() + 1)
  const day = addZero(now.getDate())
  const hh = addZero(now.getHours())
  const mm = addZero(now.getMinutes())
  const ss = addZero(now.getSeconds())
  const timer = year + '-' + month + '-' + day + ' ' + hh + ':' + mm + ':' + ss
  return timer
}

export default {
  formatNumber,
  formatTime,
  toast,
  getNowFormatDate
}
