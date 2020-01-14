// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const mdata = event.data;
  console.log(mdata)
  const result = await db.collection('books').add({
    data: {
      ...mdata,
      time: new Date(mdata.time)
    },
  })
  return {
    result,
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}