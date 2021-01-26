const { sendData } = require("../utils");
const { call } = require("../services/api");
const AccountServ = require("../services/account");
const { async } = require("rxjs");

module.exports = {
  /**
   * @api {post} /certifiers  注册监督机构
   * @apiName 监管机构注册
   * @apiGroup Certifier
   * @apiParam {String} cert_address 
   * @apiParam {String} cert_name
   * @apiSuccess {String} msg 结果描述
   * @apiSuccess {Number} code 状态码 200是成功，403是无权限
   * @apiSuccess {Object[]} data 数据
   */
  createCertifier: async (ctx, next) => {
    const type = ctx.cookies.get('type')
    const { cert_address, cert_name } = ctx.request.body
    if (type != "administrator") {
      sendData(ctx, {}, 'UNAUTHORIZED', '您没有管理员权限', 403)
    }
    const res = await call({
      // TODO: finish the storage of contract
      contractAddress: AccountServ.getContractAddress(),
      contractName: AccountServ.getContractName(),
      function: "registerCertifier",
      parameters: [cert_address, cert_name]
    })
    sendData(ctx, res, 'OK', "注册监督机构成功", 200)
  },

  /**
   * @api {get} /certifiers 获取全部监督机构
   * @apiGroup Certifier
   * @apiSuccess {Object[]} data 监督机构数组
   * @apiSuccess {String} data.addr 
   * @apiSuccess {String} data.name
   * @apiSuccess {String} msg 结果描述
   * @apiSuccess {Number} code 状态码 200是成功
   */
  getAllCertifiers: async (ctx, next) => {

  },

  /**
   * @api {get} /certifiers/:addr 根据地址获取监督机构
   * @apiGroup Certifier
   * @apiSuccess {Object[]} data 监督机构数组
   * @apiSuccess {String} data.addr 
   * @apiSuccess {String} data.name
   * @apiSuccess {String} msg 结果描述
   * @apiSuccess {Number} code 状态码 200是成功
   */
  getCertifierByAddress: async (ctx, next) => {

  }
}