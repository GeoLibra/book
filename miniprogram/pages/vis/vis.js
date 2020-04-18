import * as echarts from '../../ec-canvas/echarts';
const util = require('../../common/util.js');
const currentMonthFirst = util.getCurrentMonthFirst;
const curDate = util.curDate;
const toTimeStamp = util.toTimeStamp;
const dateFormat = util.dateFormat;
const getWeekDay = util.getWeekDay;
const app = getApp();
let chart = null;

function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    color: ['#1890ff'],
    grid: {
      x: 50,
      x2: 50,
      y: 30,
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        formatter: function (value) {
          const date = new Date(value);
          return dateFormat('mm-dd', date);
        },
      },
      data: []
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      name: '支出',
      data: [],
      type: 'bar',
      //   label: {
      //     show: true,
      //     position: 'inside'
      // },
    }],
    tooltip: {
      // confine: true,
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter: function (params) {
        const {
          axisValue,
          data
        } = params[0];
        return `${axisValue}\n${getWeekDay(axisValue)}\n支出：${data}`;
      }
    },
  };

  chart.setOption(option);
  return chart;
}

Page({
  data: {
    ec: {
      onInit: initChart
    },
    sumCost: 0,
    month: dateFormat('YYYY-mm', new Date()),
  },
  onLoad: function (options) {
    const etime = dateFormat('YYYY-mm-dd', new Date());
    setTimeout(() => {
      this.queryByMonth(etime);
    }, 0);
  },
  bindDateChange: function (e) {
    console.log(e);
    this.setData({
      month: e.detail.value
    })
    this.queryByMonth(e.detail.value);
  },
  queryByMonth: function (stime) {
    wx.cloud.init({
      env: app.globalData.ENV,
      traceUser: true,
    });

    const that = this;
    wx.cloud.callFunction({
        // 云函数名称
        name: 'queryGroupBy',
        // 传给云函数的参数
        data: {
          // openid: app.globalData.openid,
          time: stime,
        },
      })
      .then(res => {
        let sumCost = 0;
        const time = [];
        const cost = [];
        console.log(res)
        const data = res.result.list.forEach((item) => {
          sumCost += item.cost;
          time.push(item._id.date);
          cost.push(item.cost);
        });
        that.setData({
          sumCost: sumCost.toFixed(2)
        });
        console.log(time, cost);
        chart.setOption({
          xAxis: {
            data: time,
          },
          series: [{
            data: cost,
          }]
        });
      });
  },
  // initChart: function () {
  //   const that = this;
  //   this.echartsComponnet.init((canvas, width, height, dpr) => {
  //     // 初始化图表
  //     chart = echarts.init(canvas, null, {
  //       width: width,
  //       height: height,
  //       devicePixelRatio: dpr // new
  //     });
  //     chart.setOption(that.getOption());
  //     // 注意这里一定要返回 chart 实例，否则会影响事件处理等
  //     return chart;
  //   });
  // },
  // setOption: function () {
  //   chart.clear(); // 清除
  //   chart.setOption(this.getOption()); //获取新数据
  // },
  // getOption: function () {
  //   // 指定图表的配置项和数据
  //   const option = {
  //     xAxis: {
  //       type: 'category',
  //       data: [],
  //     },
  //     yAxis: {
  //       type: 'value'
  //     },
  //     series: [{
  //       data: [],
  //       type: 'bar'
  //     }],
  //   }
  //   return option;
  // },
});