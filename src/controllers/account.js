const { sendData } = require("../utils");
const { init } = require('../services/init')
const { getAllAccounts } = require("../services/account");
const { async } = require("rxjs");
const AccountServ = require("../services/account")
const { deploy, call, getAllContract } = require("../services/api");


module.exports = {
  // getAccounts: async (ctx, next) => {
  //   const res = await getAllAccounts();
  //   return sendData(ctx, res, 'OK', '获取全部账户成功', 200);
  // },
  // register: async (ctx, next) => {
  //   const { contractName, contractAddress } = ctx.request.body
  //   await init(contractName, contractAddress);
  //   return sendData(ctx, {}, 'OK', '注册成功', 200);
  // },


  /**
   *
   * @api {post} /accounts/login 登录
   * @apiName 登录
   * @apiGroup Account
   * @apiParam {String} addr 地址，一串哈希值，0x开头，总长度(包含0x)为42，例如(0x27a28f09ec7accce2eecc27ebcd9453226ed3e52)
   * @apiSuccess {String} msg 结果描述
   * @apiSuccess {Number} code 状态码
   * @apiSuccess {String} data 用户的类型
   */
  login: async (ctx, next) => {
    const { addr } = ctx.request.body
    let ca = await AccountServ.getContractAddress()
    const res = await call({
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "getAllRole",
      parameters: [addr]
    })
    if (res.output.result[0] == '') {
      sendData(ctx, '', 'ERROR', '登录失败，该地址不存在', 403)
    } else {
      ctx.cookies.set('addr', addr, { expires: new Date('2022-02-15') })
      ctx.cookies.set('type', res, { expires: new Date('2022-02-15') })
      return sendData(ctx, res.output.result[0], 'OK', '登录成功', 200)
    }
  },
}