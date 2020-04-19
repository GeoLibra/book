// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const _id = event._id;
  const data = event.data;

  // const res = await db.collection('books').doc(
  //   _id
  // ).set({
  //   data: {
  //     ...data,
  //     stime: new Date(data.stime)
  //   }
  // });
  const res = await db.collection('books').where({
    _id,
    _openid: wxContext.OPENID
  }).update({
    data: {
      ...data, 
      stime: new Date(data.stime)
    },
  });
  console.log(res)
  const {
    stats
  } = res;

  return {
    num: stats.updated,
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}