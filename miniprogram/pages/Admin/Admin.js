// pages/Admin/Admin.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: false,
    pass: false,
    meInfo: false,
    admin: false,
    nav: {
      className: '',
      upElement: 0,
      unwind: false,
      left: [{
          name: '首页',
          icon: 'shouye',
          page: 'a',
          className: 'on'
        },
        {
          name: '图表',
          icon: 'tubiao',
          page: 'b'
        },
        {
          name: '表格',
          icon: 'excel',
          page: 'c'
        },
        {
          name: '公告',
          icon: 'gonggao',
          page: 'c'
        },
        {
          name: '用户',
          icon: 'guanli',
          page: 'c'
        },
        {
          name: '信息',
          icon: 'jibenxinxi',
          page: 'c'
        },
        {
          name: '活动',
          icon: 'huodong',
          page: 'c'
        },
        {
          name: '设置',
          icon: 'shezhi',
          page: 'c'
        },
      ],
    },
    weather: {},
    user: {
      page: 0
    },
    // 摇一摇活动
    yyy: {},
    // 参与活动
    cy: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onReady: function(options) {
    this.setData({
      admin: app.globalData.admin
    });
    !this.data.admin ?
      this.loading() :
      this.setData({
        toast: {
          content: '欢迎回来!管理员 ' + this.data.admin,
          icon: 'zhiwen',
          hideTime: 4000
        }
      });

    this.activity();
    this.getWeather();
    if (!this.data.admin) return;
  },

  /**
   * weather 天气函数
   */
  getWeather: function() {
    console.log('API 天气获取中...');
    // 天气获取
    let self = this;
    wx.request({
      url: 'http://t.weather.sojson.com/api/weather/city/101210201',
      success: res => {
        if (res.statusCode === 200) {
          let weatherType = res.data.data.forecast[0].type,
            weatherIcon = {
              '阴': 'yin',
              '晴': 'qing',
              '多云': 'duoyun',
              '阵雨': '1',
              '雷雨': 'leiyu'
            };
          res.data.data.forecast[0].icon = weatherIcon[weatherType];
          self.setData({
            weather: res.data
          });
        }
      }
    });
  },

  /**
   * 左侧的导航栏点击事件
   */
  navClick: function(e) {
    let ID = e.target.dataset.index,
      nav = this.data.nav;

    if (ID === undefined) return;
    // 判断参数
    nav.left[ID].className = 'on';
    if (nav.upElement !== -1 && nav.upElement != ID && nav.left[nav.upElement].className) {
      nav.left[nav.upElement].className = undefined;
      nav.unwind && (nav.unwind = !nav.unwind);
    } else if (!this.data.meInfo) {
      nav.unwind = !nav.unwind;
    }
    this.updatePage(ID);
    nav.upElement = ID;
    this.setData({
      nav: nav,
      meInfo: false
    });

  },

  /**
   * 搜索回车事件
   */
  searchKey: function(e) {
    console.log('搜索回车!!!');
    console.log(e);
  },

  /**
   * 显示关于我
   */
  toggleMe: function() {
    let upEl = this.data.nav.upElement;
    if (upEl !== -1) {
      this.data.nav.unwind = false;
      this.data.nav.upElement = -1;
      this.data.nav.left[upEl].className = undefined;
    }
    this.setData({
      nav: this.data.nav,
      meInfo: true
    });
  },

  /**
   * 按下登录
   */
  login: function() {


    if (!this.data.pass || !this.data.user) {
      return this.setData({
        toast: {
          text: '数据填写不完整',
          icon: 'error'
        }
      });
    }
    
    if ('sjbfldsxh' === this.data.pass && 'admin' === this.data.user) {
      console.log(app.globalData.user)
      this.setData({
        admin: app.globalData.user.nickName
      });
      app.globalData.admin = app.globalData.user.nickName;

      this.setData({
        toast: {
          text: '欢迎回来!管理员 ' + this.data.admin,
          icon: 'zhiwen',
          hideTime: 4000
        }
      });
    } else {
      this.setData({
        toast: {
          text: '账号或密码错误!',
          icon: 'error',
          callback: this.loading
        }
      });
    }

  },

  loading: function() {
    this.setData({
      toast: {
        text: "等待验证...",
        icon: "zhiwen",
        hideTime: false
      }
    });
  },

  /**
   * 首页获取
   */

  unloadHome: function() {
    this.getWeather();
  },

  /**
   * 用户管理页函数
   */

  unloadUserList: function() {
    let userBase = wx.cloud.database().collection('user'),
      user = this.data.user;

    userBase.count().then(count => {
      userBase = user.page ? userBase.skip(user.page * 20) : userBase;
      userBase.get({
        success: res => {
          user.count = count.total;
          user.list = res.data;
          this.setData({
            user: user
          });
        }
      })
    })

  },

  /**
   * 更新页面信息
   */
  updatePage: function(id) {
    switch (id) {
      case 4:
        this.unloadUserList();
        break;

      case 0:
        this.unloadHome();
        break;

      case 6:
        this.activity();
        break;

    }
  },

  /**
   * 设置值
   */
  setValue: function(e) {
    let json = {};
    json[e.target.id] = e.detail.value;
    this.setData(json);
  },

  /**
   * 活动页面
   */
  activity: function() {
    let db = wx.cloud.database();
    db.collection('activity').doc('W_znnJSXoyWmnPDX').get({
      success: res => {
        if (res.data.name) {
          let val = res.data;
          this.setData({
            yyy: {
              lm: val.yyy_lm,
              state: val.yyy_state,
              time: val.yyy_time,
            }
          });
        }
      }
    });
  },
  /**
   * 参与
   */
  unloadActivity_cy: function() {
    wx.cloud.callFunction({
      name: 'deleteDataBase',
      data: {
        basedata: 'canyu'
      },
      success: res => {
        this.setData({
          toast: {
            text: '活动数据重置成功!',
            icon: 'success',
            hideTime: 3000
          }
        });
      }
    });
  },
  activity_cy: function () {
    let slef = this;
    wx.cloud.database().collection('activity').where({
      name: 'admin'
    }).get({
      success: data => {
        if (data = data.data[0]) {
          console.log(data, slef.setData)
          slef.setData({
            cy: {
              state: data.cy_state
            }
          });
          console.log(slef.data)
          off();
        }
      }
    });

    function off() {
      console.log(slef.data.cy.state)
      wx.cloud.callFunction({
        name: 'setSQL',
        data: {
          basedata: 'activity',
          id: 'W_znnJSXoyWmnPDX',
          value: {
            cy_state: !slef.data.cy.state
          }
        },
        success: () => {
          slef.setData({
            cy: {
              state: !slef.data.cy.state
            }
          });
        }
      });
      (this.data.cy.state !== undefined) && off();
    }
  },
  /**
   * 摇一摇
   */
  saveActivity_yaoyiyao: function(e) {
    console.log(e)
    wx.cloud.callFunction({
      name: 'setSQL',
      data: {
        basedata: 'activity',
        id: 'W_znnJSXoyWmnPDX',
        value: e.detail.value
      },
      success: res => {
        this.activity();
        this.setData({
          toast: {
            text: '保存成功!',
            icon: 'success',
            hideTime: 3000
          }
        });
      }
    });
  },
  // 摇一摇 删除库[重置活动] 函数
  unloadActivity_yaoyiyao: function() {
    wx.cloud.callFunction({
      name: 'deleteDataBase',
      data: {
        basedata: 'yiaoyiyiao'
      },
      success: res => {
        this.activity();
        this.setData({
          toast: {
            text: '活动数据重置成功!',
            icon: 'success',
            hideTime: 3000
          }
        });
      }
    });
  },
  activity_yaoyiyao: function() {
    wx.cloud.callFunction({
      name: 'setSQL',
      data: {
        basedata: 'activity',
        id: 'W_znnJSXoyWmnPDX',
        value: {
          yyy_state: !this.data.yyy.state
        }
      },
      success: this.activity
    });

  }
})