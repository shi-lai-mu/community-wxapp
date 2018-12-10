//index.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户信息
    userImage: 'user-unlogin.png',
    userName: false,
    college: '--',
    classt: '--',
    profess: '--',
    globals: app.globalData,
    // 功能开关
    userAll: false,

    msg: {}
  },
  userAll: function() {
    this.setData({
      userAll: !this.data.userAll
    });
  },

  /**
   * 获取授权信息,并初始化部分数据
   */
  getAuthorize: function(event) {
    
    app.sendMessage.apply(this, [{
      content: "授权中...", 
      icon: "loading",
      hideTime: false
    }]);

    app.Authorize.apply(this, [app]);

  },

  /**
   * 加密函数
   */
  addPassword: function(str) {
    str = String(str);
    let xx = '';
    if (str.length > 5) {
      for (let i = 0, l = str.length - 4; i < l; i ++) xx += '*';
      str = str.slice(0, 2) + xx + str.slice(-2);
    } else {
      for (let i = 0, l = str.length - 2; i < l; i++) xx += '*';
      str = str.slice(0, 1) + xx + str.slice(-1);
    }
    return str;
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getAuthorize();
  },

  /**
   * 二维码扫描
   */
  readCode: function() {
    wx.scanCode({
      success: data => {
        console.log(data)
      }
    })
  },

  /**
   * 设置用户信息
   */
  setUserInfo: function() {
    if(app.globalData.user) {

      let user = app.globalData.user;
      // 信息初始化
      this.setData({
        userImage: user.avatarUrl
      });

    }
  },

  /**
   * 页面关闭
   */
  onHide: function() {
    app.clearMessage();
  },

  /**
   * 创建表格
   */
  createExcel: function() {

    wx.showLoading({
      title: '表格制作中...',
    })

    let db = wx.cloud.database().collection('counters');
    db.count().then(res => {
      let count = res.total,
          skip  = 1,
          limit = 20,
        table =  `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"    xmlns="http://www.w3.org/TR/REC-html40">
                    <head>
                      <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8" />
                      <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name>
                      <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
                    </head>
                    <body>
                      <table>
                  `;

      db.get().then(res => {
        let data = res.data[0];
        table += '<tr>';
        Object.keys(data).forEach(value => {
          table += `<td>${data[value]}</td>`;
        })
        table += '</tr>';
      });

      writeTable();

      // 遍历数据库
      function writeTable() {
        let s = skip;
        db.skip(skip)
        .limit(limit - skip)
        .get()
        .then(res => {
          let data = res.data;
          for (let i = 0, l = data.length; i < l; i++) {
            table += '<tr>';
            Object.keys(data[i]).forEach(value => {
              table += `<td>${data[i][value]}</td>`;
            })
            table += '</tr>';
          }
          skip += 20;
          if (count > skip)
            writeTable();
          else
            writeFile();
        });
      }

      function writeFile() {
        table += '</table></body></html>';
        wx.getFileSystemManager().writeFile({
          filePath: wx.env.USER_DATA_PATH + 'bate.xls',
          data: table,
          complete: res => {
            console.log(res, res.errMsg)
            if (res.errMsg) {
              wx.showToast({
                title: '下载失败!',
                icon: 'none'
              })
            } else {
              wx.showToast({
                title: '下载成功!',
              })
            }
          }
        });
      }

    });
    
  }
})