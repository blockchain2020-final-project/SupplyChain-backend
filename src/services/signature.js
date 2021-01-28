var crypto = require('crypto');

var sign = crypto.createSign('RSA-SHA256');
var verify = crypto.createVerify('RSA-SHA256');


module.exports = {
  // 获取签名
  getSignature: (content, privateKey) => {
    sign.update(content)
    return sign.sign(privateKey)
  },
  // 验证签名
  verifySignature: (signature, publicKey) => {
    ret = verify.verify(publicKey, signature)
    return ret
  }
}