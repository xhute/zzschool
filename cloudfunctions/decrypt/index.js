const WXBizDataCrypt = require('./WXBizDataCrypt')
const requestSync = require('./requestSync')

/*
传入参数
{
  data:{
    js_code,
    encryptedData,
    iv
  }
}

*/
exports.main = async (event, context) => {
  const code = event.data.js_code
  const appid = event.userInfo.appId
  const encryptedData = event.data.encryptedData
  const iv = event.data.iv
  const secret = 'cb7bb0ee454df970774904fe34f42ada'

  const url = {
    url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code'
  }
  const req = await requestSync(url);
  const session = JSON.parse(req);
  const sessionKey = session.session_key;
  const pc = new WXBizDataCrypt(appid, sessionKey)
  const data = pc.decryptData(encryptedData, iv)

  return data;
}
