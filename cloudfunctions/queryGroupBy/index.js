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
  const $ = db.command.aggregate
  const year = new Date(event.time).getFullYear();
  const month = new Date(event.time).getMonth()+1;
  const data = await db.collection('books')
  .aggregate()
  .addFields({
    year: $.year('$stime'),
    month: $.month('$stime')
  })
  .match({
    year: db.command.eq(year),
    month: db.command.eq(month)
  })
  .group({
     // 按 date 字段分组
     _id: {
      date:'$date',
    },
    // 让输出的每组记录有一个 cout 字段，其值是组内所有记录的 cost 字段值和
    cost: $.sum('$cost')
  }).sort({
    _id:1
    }).end();
  console.log(data);
  return data;
  // console.log(countResult);
  // const total = countResult.total;
  // // 计算需分几次取
  // const batchTimes = Math.ceil(total / 100)
  // // 承载所有读操作的 promise 的数组
  // const tasks = []
  // for (let i = 0; i < batchTimes; i++) {
  //   const promise = db.collection('books').aggregate()
  //   .group({
  //     // 按 category 字段分组
  //     _id: '$date',
  //     // 让输出的每组记录有一个 avgSales 字段，其值是组内所有记录的 sales 字段的平均值
  //     dayCost: $.sum('$cost')
  //   })
  //     .orderBy('date', 'desc').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
  //   tasks.push(promise);
  // }

  // 等待所有
  // return (await Promise.all(tasks)).reduce((acc, cur) => {
  //   return {
  //     data: acc.data.concat(cur.data),
  //     errMsg: acc.errMsg,
  //   }
  // })
}