// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const _id = event._id;
  const data = await db.collection('books').where({
    _id
  }).remove();
  console.log(data)
  const { stats } = data;
  return {
    num: stats.removed
  }
}