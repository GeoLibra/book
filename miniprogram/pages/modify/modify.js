// pages/record/record.js
const util = require('../../common/util.js');
const dateTimePicker = require('../../common/dateTimePicker.js');
const curDate = util.curDate;
const dateFormat = util.dateFormat;
const toTimeStamp = util.toTimeStamp;
const app = getApp();
let list = [];
const currentTime = curDate(new Date());
Page({
  /**
   * 页面的初始数据
   */
  data: {
    act: 'new',
    isfocus: true,
    numberindex: 0,
    typeList: app.globalData.typeList,
    typeIndex: 0,
    comment: '',
    cost: '',
    date: currentTime[0],
    time: currentTime[1],
    hasLocation: false,
    scale: 15,
    locName: '',
    address: '',
    longitude: 105.30815,
    latitude: 39.915726,
    unitList: ['￥','$'],
    unitIndex: 0,
    amoutType: 'cost',
    dateTime: null,
    dateTimeArray: null,
    startYear: 2000,
    endYear: 2050,
    _id: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(params) {
    const that = this;
    const eventChannel = that.getOpenerEventChannel();
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      const { latitude,longitude,cost,comment,amoutType, name,address,type,stime, _id,date,time } = data;
      const index = app.globalData.typeList.indexOf(type);
      const obj = dateTimePicker.dateTimePicker(that.data.startYear, that.data.endYear);
      const recordTime = new Date(stime);
      let year = (recordTime.getFullYear()+'').slice(2);
      year = parseInt(year,10);
      const month = recordTime.getMonth();
      const day = recordTime.getDate();
      const hour = recordTime.getHours();
      const minute = recordTime.getMinutes();
      const seconds = recordTime.getSeconds();
      console.log(month,day)
      const arr = [year,month,day,hour,minute,seconds];
      const dateArr = obj.dateTimeArray;
      dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

      that.setData({
        _id,
        latitude,
        longitude,
        markers: [{
          latitude,
          longitude
        }],
        hasLocation: true,
        amoutType,
        comment,
        cost,
        type,
        date,
        time,
        name,
        locName: name,
        address: address,
        typeIndex:index,
        dateTime: arr,
        dateTimeArray: dateArr,
      });
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    list = wx.getStorageSync('cashflow') || []
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  selectLocation: function(e) {
    var that = this;
    let mpCtx = wx.createMapContext("map");
    wx.getSetting({
      success(res) {
        console.log(!res.authSetting['scope.userLocation']);
        if (res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success: function() {
              wx.chooseLocation({
                success: function(res) {
                  console.log(res);
                  that.setData({
                    locName: res.name,
                    address: res.address,
                    latitude: res.latitude,
                    longitude: res.longitude,
                    markers: [{
                      latitude: res.latitude,
                      longitude: res.longitude
                    }],
                    scale: 17
                  });
                  mpCtx.moveToLocation({
                    latitude: res.latitude,
                    longitude: res.longitude
                  });
                },
                fail: function(error) {
                  console.log(error);
                }
              })
              console.log("用户已经同意位置授权");
            },
            fail() {
              console.log("用户已经拒绝位置授权");
            }
          })
        } else {
          wx.showModal({
            content: '检测到您没打开此小程序的定位权限，是否去设置打开？',
            confirmText: "确认",
            cancelText: "取消",
            success: function(res) {
              console.log(res);
              if (res.confirm) {
                console.log('用户点击确认')
                wx.openSetting({
                  success: (res) => {
                    wx.chooseLocation({
                      success: function(res) {
                        console.log(res);
                        mpCtx.moveToLocation({
                          latitude: res.latitude,
                          longitude: res.longitude
                        });
                        that.setData({
                          latitude: res.latitude,
                          longitude: res.longitude,
                          locName: res.name,
                          address: res.address,
                          markers: [{
                            latitude: res.latitude,
                            longitude: res.longitude
                          }],
                        });
                      },
                      fail: function(error) {
                        console.log(error);
                      }
                    })
                  }
                })
              } else {
                console.log('用户点击取消')
              }
            }
          });
        }
      }
    })
  },
  typeChange: function(e) {
    this.setData({
      typeIndex: e.detail.value
    })
  },
  changeDateTime(e) {
    this.setData({ dateTime: e.detail.value });
  },
  changeDateTimeColumn(e) {
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr
    });
  },
  formSubmit: function(e) {
    const { cost,comment } = e.detail.value;
    const db = wx.cloud.database()
    const {
      locName,
      address,
      longitude,
      latitude,
      typeIndex,
      dateTime,
      dateTimeArray,
      amoutType
    } = this.data;
    const date = `${dateTimeArray[0][dateTime[0]]}-${dateTimeArray[1][dateTime[1]]}-${dateTimeArray[2][dateTime[2]]}`;
    const time = `${dateTimeArray[3][dateTime[3]]}:${dateTimeArray[4][dateTime[4]]}`;
    const typeList = app.globalData.typeList;
    if (!app.globalData.openid){
      wx.showToast({
        icon: 'none',
        title: '修改失败'
      })
      return;
    }
    if (cost===""){
      wx.showToast({
        icon: 'none',
        title: '请输入金额'
      })
      return;
    }

    let costValue = 0;
    if(String(cost).indexOf('.')===-1){
      costValue = parseInt(cost);
    }else{
      costValue=parseFloat(cost);
    }
    wx.cloud.init({
      env: app.globalData.ENV,
      traceUser: true,
    });
    wx.cloud.callFunction({
      // 云函数名称
      name: 'modify',
      // 传给云函数的参数
      data: {
        // openid: app.globalData.openid,
        _id: this.data._id,
        data: {
          cost: costValue,
          type: typeList[typeIndex],
          stime: new Date(`${date} ${time}`),
          date: date,
          time: time,
          comment,
          name: locName,
          address: address,
          longitude,
          latitude,
          amoutType
        },
      },
    })
      .then(res => {
        console.log(res)
        const { num } = res.result;
        if(num>0){
          wx.showToast({
            icon: 'none',
            title: '修改成功'
          });
        }
      }).catch(err=>{
        wx.showToast({
          icon: 'none',
          title: '修改失败'
        });
        console.log(err);
      });
  },
  formReset: function(e) {
    wx.cloud.init({
      env: app.globalData.ENV,
      traceUser: true,
    });
    wx.cloud.callFunction({
      // 云函数名称
      name: 'delete',
      // 传给云函数的参数
      data: {
        // openid: app.globalData.openid,
        _id: this.data._id,
      },
    })
      .then(res => {
        const { num } = res.result;
        if(num>0){
          wx.showToast({
            icon: 'none',
            title: '删除成功'
          });
        }
      }).catch(err=>{
        wx.showToast({
          icon: 'none',
          title: '删除失败'
        });
        console.log(err);
      });
  },
  unitChange: function(e){
    console.log(e.detail)
    this.setData({
      unitIndex: e.detail.value
    })
  },
  amoutTypeChange:function(e){
    const { type } = e.currentTarget.dataset;
    console.log(type);
    this.setData({
      amoutType: type,
    });
  }
})