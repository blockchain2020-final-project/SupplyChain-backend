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
    const sender_address = ctx.cookies.get('addr')
    const { cert_address, cert_name } = ctx.request.body
    let ca = await AccountServ.getContractAddress()
    const res = await call({
      // TODO: finish the storage of contract
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "registerCertifier",
      parameters: [sender_address, cert_address, cert_name]
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
    let ca = await AccountServ.getContractAddress()
    const res = await call({
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "getAllCertifier",
      parameters: []
    })
    addrs = res.output.result[0]
    let i = 0
    let ret = []
    for (i = 0; i < addrs.length; i++) {
      addr = addrs[i];
      const temp = await call({
        contractAddress: ca,
        contractName: AccountServ.getContractName(),
        function: "getCertifier",
        parameters: [addr]
      })
      const bank = temp.output.result[0]
      console.log(temp.output.result[0])
      ret.push(bank)
    }
    sendData(ctx, ret, 'OK', '获取全部监督机构成功', 200)
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
    const addr = ctx.params.address
    let ca = await AccountServ.getContractAddress()
    const res = await call({
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "getCertifier",
      parameters: [addr]
    })
    sendData(ctx, res.output.result, 'OK', '根据地质获取监督机构成功', 200)
  },

  /**
   * @api {post} /certifiers/sendcredit 监管机构发送信用点给核心企业
   * @apiName 监管机构发送信用点给核心企业
   * @apiGroup Certifier
   * @apiParam {String} core_company_address  
   * @apiParam {Number} amount      要发放的信用点数量
   * @apiSuccess {Object} data
   * @apiSuccess {String} msg 结果描述
   * @apiSuccess {Number} code 状态码
   */
  sendCreditPointToBank: async (ctx, next) => {

  }

}