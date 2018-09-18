const WXBizDataCrypt = require('./WXBizDataCrypt')
const requestSync = require('./requestSync')
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
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
const SECRET = 'cb7bb0ee454df970774904fe34f42ada'

exports.main = async (event, context) => {
  const appid = event.userInfo.appId
  const code = event.data.js_code
  const encryptedData = event.data.encryptedData
  const iv = event.data.iv
    const db = cloud.database()
    const openid = event.userInfo.openid
  var sessionKey;
  if( !code ){
    db.collection('User').where({
      openid : openid
    }).get().then( data=>{
      sessionKey = data.session_key
    }).catch(err =>{
      console.log('db get error:',err)
    })
  }else{
    const url = {
      url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid +
        '&secret=' + SECRET +
        '&js_code=' + code +
        '&grant_type=authorization_code'
    }
    const req = await requestSync(url)
    const session = JSON.parse(req);
    console.log('session:', session)

    sessionKey = session.session_key
    db.collection('User').where({
      openid:openid
    }).set({
      session_key:sessionKey
    })
  }

  if (sessionKey) {
    const pc = new WXBizDataCrypt(appid, sessionKey)
    const data = pc.decryptData(encryptedData, iv)
    return data
  }
  return {}
}
