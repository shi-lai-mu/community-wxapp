// pages/signUp/signUp.js
const app = getApp();

Page({

  data: {

    radio_v1: [
      {
        name: '建筑工程学院',
        ID: 0,
        data: [
          '市政工程技术',
          '建设工程管理',
          '工程造价',
          '工程造价[中外合作]',
          '工程造价',
        ]
      }, 
      {
        name: '机电与汽车工程学院',
        ID: 1,
        data: [
          '工业机器人技术',
          '新能源汽车技术',
          '电气自动化技术',
          '工业过程自动化技术',
          '机电一体化技术',
          '机电一体化技术',
          '汽车检测与维修',
        ]
      },
      {
        name: '物流与信息工程学院',
        ID: 2,
        data: [
          '应用电子技术',
          '连锁经营管理',
          '软件技术',
          '物流信息技术',
          '物流管理',
        ]
      },
      {
        name: '商贸与经济管理学院',
        ID: 3,
        data: [
          '会计',
          '投资与理财',
          '国际贸易实务',
          '电子商务',
          '市场营销',
          '互联网金融',
        ]
      },
      {
        name: '旅游与公共管理学院',
        ID: 4,
        data: [
          '文秘',
          '人力资源管理',
          '旅游管理',
          '酒店管理',
          '商务英语',
        ]
      },
      {
        name: '艺术设计学院',
        ID: 5,
        data: [
          '服装与服饰设计',
          '视觉传播设计与制作',
          '视觉传播设计与制作[艺术类]',
          '室内艺术设计',
          '室内艺术设计[艺术类]',
        ]
      }
    ],
    radio_v2: [],
    signUpData: {
      name: null,
      classt: null,
      qq: null,
      phone: null,
      sorting: null,
      profess: null
    },

    // 姓名
    name: { value: "", error: false },
    // 班级
    classt: { value: "", error: false },
    // 手机号
    phone: { value: "", error: false },
    // qq
    qq: { value: "", error: false },
    // 分院
    sorting: { value: "", error: false },
    // 专业
    profess: { value: "", error: false },

    userInfo: null
  },

  getAuthorize: function() {
    app.sendMessage.apply(this, [{
      content: "授权中...",
      icon: "loading",
      hideTime: false
    }]);

    app.Authorize.apply(this, [app]);
  },

  /**
   * 分院 数值改变事件
   */
  radio1Chang: function (e) {

    let data = this.data['radio_v1'][e.detail.value];
    if (!data) return;
    
    this.setData({
      sorting: {
        value: data.name,
        error: false
      },
      radio_v2: data.data
    });

  },

  /**
   * 专业 数值改变事件
   */
  radio2Chang: function (e) {

    this.setData({
      profess: {
        value: e.detail.value,
        error: false
      }
    });

  },

  /**
   * 提交按钮事件
   */
  submit: function() {

    // 返回顶部
    wx.pageScrollTo({
      scrollTop: 0
    });

    /**
     * 检测格式是否正确
     */
    let data = this.data,
        self = this,
        ok = 0;

    // 识别失败
    function setError(key, error) {
      let obj = {};
      obj[key] = {
        value: this.data[key].value,
        error: error
      };
      this.setData(obj);
    }

    // 成功识别
    function setNice(key) {
      let obj = {};
      obj[key] = {
        value: this.data[key].value,
        error: '',
        ok: this.data[key].value
      };
      obj.signUpData = this.data.signUpData
      obj.signUpData[key] = this.data[key].value;
      ok++;
      this.setData(obj);
      if (ok === 6) this.signUp();
    }
    
    Object.keys(data).forEach((key, val) => {

      if (data[key].ok) ok ++;

      if (data[key].value !== undefined  && !data[key].ok) {
        setError.apply(self, [key, '']);

        setTimeout(() => {
          if (data[key].value) {

            // 姓名
            if (key == 'name') {
              if ((/^([\u4e00-\u9fa5]){2,5}$/).test(data[key].value)) {
                
                const db = wx.cloud.database(),
                      _  = db.command
                // 判断 成员是否已报名 或 微信是否被绑定
                db.collection('user').where(_.or([
                  { _openid: app.globalData.user.openId },
                  { name:    data[key].value }
                ])).get({
                  success: res => {
                    if (res.data.length) {
                      setError.apply(self, [key, '该社员已报名 或 本微信已绑定其他社员']);
                    } else setNice.apply(self, [key]);
                  }
                });

              } else setError.apply(self, [key, '姓名不合法!']);

            } else if (key == 'classt') {
              if (data[key].value.length === 4) {
                setNice.apply(self, [key]);
              } else setError.apply(self, [key, '班级长度不合法 应为4位!']);

            } else if (key == 'phone') {
              if ((/^[1][3,4,5,7,8][0-9]{9}$/).test(data[key].value)) {
                setNice.apply(self, [key]);
              } else setError.apply(self, [key, '手机号不合法']);

            } else if (key == 'qq') {
              if ((/^[0-9]{6,}$/).test(data[key].value)) {
                setNice.apply(self, [key]);
              } else setError.apply(self, [key, 'QQ号不合法']);

            } else {
              setNice.apply(self, [key]);
            }

          } else setError.apply(self, [key, '值不能为空!']);

        }, val * 200);

      }
    });

  },

  signUp: function() {
    this.data.signUpData.register = new Date();
    wx.cloud.database().collection('user').add({
      data: this.data.signUpData,
      success: res => {

        if (res.errMsg == 'collection.add:ok') {
          wx.showToast({
            title: '注册成功!',
            success: () => {
              setTimeout(() => {
                wx.navigateTo({
                  url: '../index/index'
                });
              }, 1000);
            }
          });
        }

      },
      fail: console.log
    })
  },

  /**
   * 输入框输入事件
   */
  input: function(e) {
    this.data[e.target.id].value = e.detail.value;
  },
})