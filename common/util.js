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
  // return [year, month, day].map(formatNumber).join('-')+' 00:00';
  return dateFormat('YYYY-mm-dd',date);

}
const formatNumber=(n)=> {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const toTimeStamp = (str)=>{
  return Date.parse(str);
}

const dateFormat=(fmt, date)=>{
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(),        // 年
    "m+": (date.getMonth() + 1).toString(),     // 月
    "d+": date.getDate().toString(),            // 日
    "H+": date.getHours().toString(),           // 时
    "M+": date.getMinutes().toString(),         // 分
    "S+": date.getSeconds().toString()          // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    };
  };
  return fmt;
}
const getWeekDay= (date)=>{
  const weekDay = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];  
  const myDate = new Date(Date.parse(date)); 
  return weekDay[myDate.getDay()];
}
module.exports = {
  formatTime: formatTime,
  curDate: curDate,
  getCurrentMonthFirst: getCurrentMonthFirst,
  toTimeStamp: toTimeStamp,
  dateFormat: dateFormat,
  getWeekDay: getWeekDay
}