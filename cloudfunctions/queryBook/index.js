const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const MAX_LIMIT = 100
exports.main = async(event, context) => {
  // 先取出集合记录总数
  const wxContext = cloud.getWXContext();
  const _ = db.command;
  const {
    ENV,
    OPENID,
    APPID
  } = cloud.getWXContext()
  console.log(OPENID);
  console.log(event);
  const countResult = await db.collection('book')
  .where(
    _.and([
      { '_openid': OPENID},
      { time: _.gte(new Date(event.stime+':00'))},
      { time: _.lte(new Date(event.etime+':00'))}
    ]))
    .count();
  console.log(countResult);
  const total = countResult.total;
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('book')
    .where(
      _.and([
        { '_openid': OPENID },
        { time: _.gte(new Date(event.stime + ':00')) },
        { time: _.lte(new Date(event.etime + ':00')) }
      ]))
      .orderBy('time', 'desc').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise);
  }

  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}