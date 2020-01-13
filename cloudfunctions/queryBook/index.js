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
  const countResult = await db.collection('book').where({
    '_openid': OPENID,
    time: _.gte(event.stime),
    etime: _.lte(event.etime)
  }).count();
  console.log(countResult);
  const total = countResult.total;
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('book').skip(i * MAX_LIMIT).where({
      '_openid':OPENID,
      time: _.gte(event.stime),
      etime: _.lte(event.etime)
    }).limit(MAX_LIMIT).get()
    console.log(promise);
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