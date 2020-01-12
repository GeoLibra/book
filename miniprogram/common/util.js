const formatTime = (date)=> {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const  curDate=(date)=> {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()

  return [[year, month, day].map(formatNumber).join('-'), [hour, minute].map(formatNumber).join(':')]
}
/**
 * 获取当前月的第一天
 */
const getCurrentMonthFirst=()=>{
  var date = new Date();
  date.setDate(1);
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')+' 00:00';
}
const formatNumber=(n)=> {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const toTimeStamp = (str)=>{
  return Date.parse(str);
}
const ENV = 'hgis-0317w';
module.exports = {
  formatTime: formatTime,
  curDate: curDate,
  getCurrentMonthFirst: getCurrentMonthFirst,
  ENV: ENV,
  toTimeStamp:toTimeStamp,
}