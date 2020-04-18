// pages/list/list.js
const util = require('../../common/util.js');
const currentMonthFirst = util.getCurrentMonthFirst;
const curDate = util.curDate;
const toTimeStamp = util.toTimeStamp;
const dateFormat = util.dateFormat;
const getWeekDay = util.getWeekDay;
const app = getApp();
const imgPath = {};
app.globalData.typeList.forEach((item)=>{
  imgPath[item] = `/images/class/${item}.png`;
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateList: [],
    accountList: [],
    weekday: [],
    month: dateFormat('YYYY-mm', new Date()),
    sumCost: 0,
    sumIncome: 0,
    dayCost: {},
    classImg: imgPath,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const time = dateFormat('YYYY-mm', new Date());
    this.queryAccount(time);
  },
  queryAccount: function(time){
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
        time,
      },
    })
      .then(res => {
        const { data, sumCost, sumIncome, dateList, dayCost } = res.result;
        console.log(data)
        this.setData({
          accountList: data,
          dateList: dateList.map(item=>dateFormat('m月d日', new Date(item))),
          weekday: dateList.map(item=>getWeekDay(item)),
          sumCost,
          sumIncome,
          dayCost,
        });
      })
      .catch(console.error)
  },
  bindDateChange: function (e) {
    console.log(e);
    this.setData({
      month: e.detail.value
    })
    this.queryAccount(e.detail.value);
  },
  itemClick: function(e){
    const { day } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../modify/modify',
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', day)
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})