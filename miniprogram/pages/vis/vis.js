import F2 from '@antv/wx-f2';
const util = require('../../common/util.js');
const currentMonthFirst = util.getCurrentMonthFirst;
const curDate = util.curDate;
const toTimeStamp = util.toTimeStamp;
const dateFormat = util.dateFormat;
const getWeekDay = util.getWeekDay;
const app = getApp();
let chart = null;
function initChart(canvas, width, height, F2) { // 使用 F2 绘制图表
  const etime = curDate(new Date()).join(' ');
  const stime = currentMonthFirst();
  const dateValue=[];
  for (let i = new Date(stime); i <= new Date(etime);){
    dateValue.push(dateFormat('YYYY-mm-dd', i));
    const dateTime = i.setDate(i.getDate() + 1);
    i = new Date(dateTime);
  }
  console.log(dateValue);
  chart = new F2.Chart({
    el: canvas,
    width,
    height
  });
  chart.source([], {
    cost: {
      // tickCount: 5,
      min: 0
    },
    date: {
      type: 'timeCat',
      // range: [0, 1],
      // tickCount: 5,
      values: dateValue,
      mask: 'MM-DD',
    }
  });
  chart.tooltip({
    showItemMarker: false,
    onShow(ev) {
      const { items } = ev;
      items[0].name = null;
      items[0].name = `${items[0].title} ${getWeekDay(items[0].origin.date)}`;
      // items[0].name = getWeekDay(items[0].date);
      items[0].value = '¥ ' + items[0].value;
    }
  });
  chart.interval().position('date*cost');
  chart.interaction('pan');
  chart.scrollBar({
    mode: 'x',
    xStyle: {
      backgroundColor: '#e8e8e8',
      fillerColor: '#808080',
      offsetY: -2
    }
  });
  chart.render();
  return chart;
}
Page({
  data: {
    opts: {
      onInit: initChart
    },
    sumCost: 0,
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
        const data = res.result.list.map((item) => {
          sumCost += item.cost;
          return {
            cost: item.cost,
            date: item._id.date,
          };
        });
        that.setData({
          sumCost: sumCost.toFixed(2)
        });
        console.log(data)
        let chartDom = that.selectComponent('#column-dom');
        chartDom.chart.changeData(data);
      });
  }
});
