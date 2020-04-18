const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const MAX_LIMIT = 100
exports.main = async (event, context) => {
  // 先取出集合记录总数
  const wxContext = cloud.getWXContext();
  const _ = db.command;
  const {
    ENV,
    OPENID,
    APPID
  } = cloud.getWXContext();
  const $ = db.command.aggregate;
  const year = new Date(event.time).getFullYear();
  const month = new Date(event.time).getMonth() + 1;
  const countResult = await db.collection('books')
    .aggregate()
    .addFields({
      month: $.month('$stime')
    })
    .match({
      month: db.command.eq(month)
    }).group({
      _id: null,
      count: $.sum(1),
    }).end();
  console.log(countResult);
  const total = countResult.list[0].count;
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = [];
  console.log(new Date(year,month-1,1),new Date(year,month,0));
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('books')
      .where(
        _.and([
          { '_openid': OPENID },
          { stime: _.gte(new Date(year,month-1,1)) },
          { stime: _.lte(new Date(year,month,0)) }
        ]))
      // .aggregate()
      // .addFields({
      //   month: $.month('$stime')
      // })
      // .match({
      //   month: month
      // })
      .orderBy('stime', 'desc').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise);
  }
  const data = (await Promise.all(tasks)).reduce((acc, cur) => {
    return acc.data.concat(cur.data);
  });
  const dateList = [];
  const result = [];
  let sumCost = 0;
  let sumIncome = 0;
  const dayCost = [];
  data.data.forEach((item)=>{
    const index = dateList.indexOf(item.date)
    if(index === -1){
      result.push({
        dayData: [item]
      });
      dateList.push(item.date);
      dayCost.push(item.cost);
    }else{
      result[index].dayData.push(item);

      dayCost[index] += item.cost;
    }
    sumCost+=item.cost;
    sumIncome+=item.sumIncome || 0;
  });
  console.log(dayCost);
  // 等待所有
  return {
    dayCost,
    dateList,
    data: result,
    sumCost: sumCost.toFixed(2),
    sumIncome: sumIncome.toFixed(2),
  };
}