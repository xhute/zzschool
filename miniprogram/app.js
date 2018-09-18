//app.js
App({
  onLaunch: function (opt) {
    var that = this
    console.log(opt)
    // 如果是群分享的，获取群信息
    if (opt.shareTicket) {
      wx.getShareInfo({
        shareTicket: opt.shareTicket,
        success: shareInfo => {
          wx.checkSession({
            success: function () {
              
              var js_code = wx.getStorageSync('js_code')
              console.log('has session',js_code)
              wx.cloud.callFunction({
                name: 'decrypt',
                data: {
                  data: {
                   js_code:js_code,
                    encryptedData: shareInfo.encryptedData,
                    iv: shareInfo.iv
                  }
                },
                success: cloudFunInfo => {
                  console.log('cloudFunction', cloudFunInfo)
                  that.globalData.openGId = cloudFunInfo.result.openGId
                  console.log('openGId', that.globalData.openGId)
                },
                fail: err => {
                  console.log('callFunction err:', err)
                }
              })
            },
            fail: function () {
              wx.login({
                success: loginInfo => {
                  wx.setStorage({key:'js_code',data:loginInfo.code})
                  console.log('wx.login',loginInfo)
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
                      console.log('cloudFunction', cloudFunInfo)
                      that.globalData.openGId = cloudFunInfo.result.openGId
                      console.log('openGId', that.globalData.openGId)
                      // wx.reLaunch({
                      //   url: '/pages/help/help'
                      // })
                    },
                    fail: err => {
                      console.log('callFunction err:', err)
                    }
                  })
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
