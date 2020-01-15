// pages/addFunction/addFunction.js
const util = require('../../common/util.js');
const currentMonthFirst = util.getCurrentMonthFirst;
const curDate = util.curDate;
const toTimeStamp = util.toTimeStamp;
const dateFormat = util.dateFormat;
const app = getApp();
Page({
  data: {
    onInitChart(F2, config) {
      const chart = new F2.Chart(config);
      const etime = curDate(new Date()).join(' ');
      const stime = currentMonthFirst();
      console.log(etime, stime);
      wx.cloud.init({
        env: app.globalData.ENV,
        traceUser: true,
      });
      wx.cloud.callFunction({
        // 云函数名称
        name: 'queryBook',
        // 传给云函数的参数
        data: {
          // openid: app.globalData.openid,
          stime: stime,
          etime: etime
        },
      })
        .then(res => {
          const data = res.result.data.map(item => 
          {
            return {
              ...item,
              time: dateFormat("YYYY-mm-dd HH:MM", new Date(item.time))
            };
          }
          );
          console.log(data)
           chart.source(data, {
            date: {
              range: [0, 1],
              type: 'timeCat',
              mask: 'MM-DD'
            },
            value: {
              max: 300,
              tickCount: 4
            }
          });
          chart.line().position('time*cost').adjust('stack');
          chart.axis('time', {
            label:{
              autoHide:true
            }
          });
          chart.render();
          // 注意：需要把chart return 出来
          return chart;
        })
        .catch(console.error)
      
      
    }
  },
});