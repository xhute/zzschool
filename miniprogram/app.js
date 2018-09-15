//app.js
App({
  onLaunch: function (opt) {
    console.log(opt)
    // 如何是群分享的，获取群信息
    if (opt.shareTicket) {
      wx.getShareInfo({
        shareTicket: opt.shareTicket,
        success: shareInfo => {
          wx.login({
            success: loginInfo => {
              wx.cloud.callFunction({
                name: 'decrypt',
                data: {
                  data: {
                    js_code: loginInfo.code,
                    encryptedData: shareInfo.encryptedData,
                    iv: shareInfo.iv
                  }
                },
                success: cloudFunInfo => {
                  console.log(cloudFunInfo.result)
                },
                fail: err => {
                  console.log('callFunction err:', err)
                }
              })
            }
          })
        },
        fail: err => {
          console.log("getShareInfo error:" + err)
        }
      })
    }

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {}

    this.globalData.scene = opt.scene;
  }
})
