// pages/addFunction/addFunction.js
const util = require('../../common/util.js');
const currentMonthFirst = util.getCurrentMonthFirst;
const curDate = util.curDate;
const toTimeStamp = util.toTimeStamp;
const dateFormat = util.dateFormat;
const app = getApp();
Page({
  data: {
    onInitChart:(F2, config)=> {
      console.log(config)
      const chart = new F2.Chart(config);
      const etime = curDate(new Date()).join(' ');
      const stime = currentMonthFirst();
      wx.cloud.init({
        env: app.globalData.ENV,
        traceUser: true,
      });
      wx.cloud.callFunction({
        // 云函数名称
        name: 'queryGroupBy',
        // 传给云函数的参数
        data: {
          // openid: app.globalData.openid,
          stime: stime,
          etime: etime
        },
      })
        .then(res => {
          const data = res.result.list.map((item)=>{
            return {
              cost:item.cost,
              date:item._id.date,
            };
          });
          console.log(data)
          chart.source(data, {
            cost: {
              tickCount: 5,
              min: 0
            },
            date: {
              type: 'timeCat',
              range: [ 0, 1 ],
              tickCount: 5,
              mask: 'MM-DD',
            }
          });
          chart.tooltip({
            showItemMarker: false,
            onShow(ev) {
              const { items } = ev;
              items[0].date = items[0].date;
              items[0].cost = '¥ ' + items[0].cost;
            }
          });
          chart.interval().position('date*cost');
          // chart.scrollBar({
          //   mode: 'x',
          //   xStyle: {
          //     backgroundColor: '#e8e8e8',
          //     fillerColor: '#808080',
          //     offsetY: -2
          //   }
          // });
          // chart.interaction('pan');
          chart.render();
          // 注意：需要把chart return 出来
          return chart;
        })
        .catch(console.error)
    },
    sumCost:0,
  },
  onLoad: function (options) {
    wx.cloud.init({
      env: app.globalData.ENV,
      traceUser: true,
    });
    const etime = curDate(new Date()).join(' ');
    const stime = currentMonthFirst();
    const that = this;
    wx.cloud.callFunction({
      // 云函数名称
      name: 'queryGroupBy',
      // 传给云函数的参数
      data: {
        // openid: app.globalData.openid,
        stime: stime,
        etime: etime
      },
    })
      .then(res => {
        let sumCost = 0;
        const data = res.result.list.map((item)=>{
          sumCost += item.cost;
        });
        
        that.setData({
          sumCost:sumCost.toFixed(2)
        });
      });
  }
});