//app.js
const msg = require('public/Toast.js');

App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      });
      this.base = wx.cloud.database();
    }

    // 公共数据
    this.globalData = {
      user: null,
      admin: false
    };

    this.sendMessage = msg.sendMessage;
    this.clearMessage = msg.clearMessage;

    // 获取授权信息
    this.Authorize = function(app, callback) {
      let self = this;

      let userInfo = wx.getStorageSync('userInfo');
      let openId = wx.getStorageSync('openId');
      if (userInfo || openId) {
        app.globalData.user = userInfo;
        app.globalData.user.openId = openId;
        self.setData({ userInfo: openId });
        callback && callback();
        return;
      }

      wx.getSetting({
        success: res => {

          // 如果已授权成功
          if (res.authSetting['scope.userInfo']) {

            wx.getUserInfo({
              success: res => {
                
                // 避免延迟,先刷新数据
                app.globalData.user = res.userInfo;
                self.setUserInfo && self.setUserInfo();

                wx.cloud.callFunction({
                  name: 'login',
                  data: app.globalData.user,
                  success: openId => {
                    app.globalData.user.openId = openId.result.openid;

                    self.setData({ userInfo: openId.result });
                    callback && callback();
                    wx.setStorage({
                      key: 'userInfo',
                      data: res.userInfo,
                    });
                    wx.setStorage({
                      key: 'openId',
                      data: openId.result.openid,
                    });
                    // 获取班级及详细信息
                    wx.cloud.database().collection('user').where({
                      _openid: openId.result.openid
                    }).get({
                      success: res => {
                        if (res.data.length) {
                          res.data[0].phone = self.addPassword(res.data[0].phone);
                          app.globalData.info = res.data[0];
                          self.setData({
                            userName: res.data[0].name,
                            college: res.data[0].sorting.substring(0, 5),
                            classt: res.data[0].classt,
                            profess: res.data[0].profess,
                            globals: app.globalData
                          });
                          // 已报名社员
                          app.sendMessage.apply(self, [{
                            content: "授权成功!登录完成!",
                            icon: "success"
                          }]);
                        } else {
                          app.sendMessage.apply(self, [{
                            content: "未找到与微信匹配的社员!请先报名...",
                            icon: "error"
                          }]);
                        }

                      }
                    });

                  }
                });

              }
            });

          } else {

            app.sendMessage.apply(self, [{
              content: "获取授权失败!",
              icon: "error"
            }]);

          }

        }
      });
    }
 
 
  }
})
