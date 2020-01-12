// pages/list/list.js
const util = require('../../common/util.js');
const currentMonthFirst = util.getCurrentMonthFirst;
const curDate = util.curDate;
const toTimeStamp = util.toTimeStamp;
const app = getApp();
const ENV = util.ENV;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const etime = curDate(new Date()).join(' ');
    const stime = currentMonthFirst();
    console.log(etime, stime);
    wx.cloud.init({
      env: ENV,
      traceUser: true,
    });
    wx.cloud.callFunction({
      // 云函数名称
      name: 'querBook',
      // 传给云函数的参数
      data: {
        stime: toTimeStamp(stime),
        etime: toTimeStamp(etime),
      },
    })
      .then(res => {
        console.log(res.result) // 3
      })
      .catch(console.error)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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