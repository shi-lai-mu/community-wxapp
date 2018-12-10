// 任务
let Task = [],
  show = null,
  self = null;

function sendMessage(data) {
  data.icon = data.icon || false;
  data.hideTime = (data.hideTime || data.hideTime === false) ? data.hideTime : 1500;
  if (!data.content) return;

  let BGColor = {
    error: 'wrong',
    success: 'chenggong',
    warning: 'jinggao',
    loading: 'loading',
    zhiwen: 'zhiwen',
    saoma: 'saoma'
  };
  self = this;

  Task.push({
    text: data.content,
    icon: BGColor[data.icon],
    back: data.icon || "",
    hide: data.hideTime,
    layer: data.layer || 1,
    callback: data.callback
  });

  // 如果 没有正在显示的Toast则显示 否则 如果是无限期显示的Toast则隐藏后显示
  !show ? showMessage() : !show['hide'] && hideMessage();
}

function showMessage() {
  let after = Task[0];
  if (after) {
    self.setData({
      msg: {
        _text: after['text'],
        _type: after['back'],
        _icon: after['icon']
      }
    });
    // 如果Toast不是false则有消失时间
    after['hide'] && setTimeout(hideMessage, after['hide']);
    show = after;
    Task.shift();
  }
}

function hideMessage() {
  show.callback && show.callback.call(self);
  // 清空显示
  show = null;
  self.setData({
    msg: {
      _text: "",
      _type: "",
      _icon: ""
    }
  });
  // 400毫秒后检测列队
  setTimeout(showMessage, 400);
}

function clearMessage() {
  show = null;
  Task = [];
  self.setData({
    msg: {
      _text: "",
      _type: "",
      _icon: ""
    }
  });
}

module.exports = {
  sendMessage: sendMessage,
  clearMessage: clearMessage
};