
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

// 通过管理员接口
exports.main = async (event, context) => {
  let { value, basedata, id } = event;
  let ss = await db.collection(basedata).doc(id)
    .update({
      data: value
    });
  return ss;
}