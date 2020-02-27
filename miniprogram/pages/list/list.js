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
    const date = new Date();
    date.setDate(1);
    const etime = curDate(new Date()).join(' ');
    const stime = dateFormat('YYYY-mm-dd', date)+' 00:00';
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
          // const time = dateFormat("YYYY-mm-dd HH:MM", new Date(item.stime));
          // let cost = 0 ;
          // if(String(cost).indexOf('.')===-1){
          //   cost =parseInt(cost);
          // }else{
          //   cost =parseFlo(cost);
          // }
          // wx.cloud.callFunction({
          //   // 云函数名称
          //   name: 'addBook',
          //   // 传给云函数的参数
          //   data: {
          //     // openid: app.globalData.openid,
          //     ...item,
          //     cost: parseInt(item.cost),
          //     stime: item.time,
          //     date: time.split(' ')[0],
          //     time: time.split(' ')[1]
          //   },
          // })
          //   .then(res => {console.log(res)});

          return {
            ...item,
            time: dateFormat("YYYY-mm-dd HH:MM", new Date(item.stime))
          };
        }
        );
        console.log(data.length)
        this.setData({
          bookList: data,
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