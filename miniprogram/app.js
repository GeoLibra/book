//app.js
App({
  data: {
    userInfo: null,
  },
  onLaunch: function() {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'hgis-0317w',
        traceUser: true,
      });
      // 调用云函数
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          const data = this.globalData;
          this.globalData ={
            openid: res.result.openid,
            ...data,
          };
          // app.globalData.openid = res.result.openid;
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err);
        }
      })
    }
    this.globalData = {
      userInfo: null,
      typeList: ['餐饮','蔬菜','水果','礼物','交通出行', '娱乐', '购物', '旅行', '房租', '水电', '服饰', '学习', '医疗','红包','通讯','快递','其他'],
      typeImg: ['catering','vegetables','fruits','gift','trip','entertainment','shopping','travel','rent','hydropower','clothes','study','medical','redpacket','telephonebill','express','others'],
    }
  }
})