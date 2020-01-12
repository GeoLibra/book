// pages/addFunction/addFunction.js

const code = `// 云函数入口函数
exports.main = (event, context) => {
  console.log(event)
  console.log(context)
  return {
    sum: event.a + event.b
  }
}`
const app = getApp();
Page({

  data: {
    result: '',
    canIUseClipboard: wx.canIUse('setClipboardData'),
  },

  onLoad: function (options) {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res);
              this.setData({
                userInfo: res.userInfo
              });
            }
          })
        }else{
        
        }
      },
      fail: error => {
        console.log(error);
      }
    });
  },

})

