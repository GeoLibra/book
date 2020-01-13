// pages/list/list.js
const util = require('../../common/util.js');
const currentMonthFirst = util.getCurrentMonthFirst;
const curDate = util.curDate;
const toTimeStamp = util.toTimeStamp;
const dateFormat = util.dateFormat;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
        stime: toTimeStamp(stime),
        etime: toTimeStamp(etime),
      },
    })
      .then(res => {
        const data = res.result.data.map(item => 
        {
          return item.time = dateFormat("YYYY-mm-dd HH:MM",new Date(item.time))
        }
        );
        this.setData({
          bookList: res.result.data,
        });
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