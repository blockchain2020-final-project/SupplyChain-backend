const { sendData } = require("../utils");
const { deploy, call, getAllContract } = require("../services/api");
const { async } = require("rxjs");
const AccountServ = require("../services/account")

module.exports = {
  /**
   *
   * @api {post} /administrator/regist 注册管理员
   * @apiName 管理员注册
   * @apiGroup Administrator
   * @apiParam {String} addr 管理员地址，一串哈希值，0x开头，总长度(包含0x)为42，例如(0x27a28f09ec7accce2eecc27ebcd9453226ed3e52)
   * @apiSuccess {String} msg 结果描述
   * @apiSuccess {Number} code 状态码
   * @apiSuccess {Object[]} data
   */
  // 注册管理员，提供一个哈希值，会同时部署合约
  register: async (ctx, next) => {
    const { addr } = ctx.request.body
    let res = await deploy('SupplyContract', [addr])
    return sendData(ctx, res, 'OK', '注册管理员成功', 200)
  },

  /**
   *
   * @api {get} /administrator 获取管理员信息
   * @apiName 获取管理员信息
   * @apiGroup Administrator
   * @apiSuccess {Object[]} data  管理员信息数组(实际只有全局唯一的管理员)
   * @apiSuccess {String} data.addr   地址
   * @apiSuccess {String} data.out_credit    管理员发放的信用点总和
   * @apiSuccess {String} msg 结果描述
   * @apiSuccess {Number} code 状态码
   */
  // 获取当前管理员信息
  getAdmins: async (ctx, next) => {
    const addr = ctx.cookies.get('addr')
    let ca = await AccountServ.getContractAddress()
    const res = await call({
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "queryAdminOutCredit",
      parameters: []
    })
    sendData(ctx, [
      {
        addr: addr,
        out_credit: res
      }
    ], 'OK', "获取管理员信息成功", 200)
  },

  /**
   * @api {post} /administrator/sendcredit 管理员发送信用点给银行
   * @apiName 管理员发送信用点给银行
   * @apiGroup Administrator
   * @apiParam {String} bank_address  
   * @apiParam {Number} amount      要发放的信用点数量
   * @apiSuccess {Object} data
   * @apiSuccess {String} msg 结果描述
   * @apiSuccess {Number} code 状态码
   */
  // 发放信用点
  sendCreditPointToBank: async (ctx, next) => {
    const sender_address = ctx.cookies.get('addr')
    let ca = await AccountServ.getContractAddress()
    const type = ctx.cookies.get('type')
    const { bank_address, amount } = ctx.request.body
    const res = await call({
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "creditDistributionToBank",
      parameters: [sender_address, bank_address, amount]
    })
    sendData(ctx, res, 'OK', "发放信用点成功", 200)
  },

  /**
   * @api {post} /administrator/recyclecredit 管理员从银行回收信用点
   * @apiGroup Administrator
   * @apiParam {String} bank_address  
   * @apiParam {Number} amount      要回收的信用点数量
   * @apiSuccess {Object} data
   * @apiSuccess {String} msg 结果描述
   * @apiSuccess {Number} code 状态码
   */
  recycleCreditFromBank: async (ctx, next) => {
    const sender_address = ctx.cookies.get('addr')
    let ca = await AccountServ.getContractAddress()
    const type = ctx.cookies.get('type')
    const { bank_address, amount } = ctx.request.body
    const res = await call({
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "creditReturnFromBank",
      parameters: [sender_address, bank_address, amount]
    })
    sendData(ctx, res, 'OK', "回收信用点成功", 200)
  },

  /**
   * @api {get} /administrator/:address 根据地址获取管理员信息
   * @apiGroup Administrator 
   * @apiSuccess {Object[]} data
   * @apiSuccess {String} data.addr // 管理员地址
   * @apiSuccess {Number} data.outCredit // 管理员发放的信用点
   */
  getAdministratorInfoByAddress: async (ctx, next) => {
    const addr = ctx.params.address
    let ca = await AccountServ.getContractAddress()
    const res = await call({
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "getAdmin",
      parameters: [addr]
    })
    sendData(ctx, res.output.result, 'OK', "获取管理员信息成功", 200)
  },

  /**
 * @api {post} /administrator/deposite 管理员给银行发钱
 * @apiGroup Administrator
 * @apiParam {String} bankAddr 银行地址
 * @apiParam {String} amount 钱数
 */
  depositeMoney: async (ctx, next) => {
    const addr = ctx.cookies.get('addr')
    let ca = await AccountServ.getContractAddress()
    const { bankAddr, amount } = ctx.request.body
    const res = await call({
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "depositCash",
      parameters: [addr, bankAddr, amount]
    })
    if (res.output.error != undefined && res.output.error != []) {
      sendData(ctx, res.output.error, 'ERROR', '管理员给银行发钱异常', 403)
    } else {
      sendData(ctx, res, 'OK', '管理员给银行发钱成功', 200)
    }
  },

  /**
   * @api {post} /administrator/withdraw 管理员给银行扣钱
   * @apiGroup Administrator
   * @apiParam {String} bankAddr 公司地址
   * @apiParam {String} amount
   */
  withdrawMoney: async (ctx, next) => {
    const addr = ctx.cookies.get('addr')
    let ca = await AccountServ.getContractAddress()
    const { bankAddr, amount } = ctx.request.body
    const res = await call({
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "withdrawCash",
      parameters: [addr, bankAddr, amount]
    })
    if (res.output.error != undefined && res.output.error != []) {
      sendData(ctx, res.output.error, 'ERROR', '管理员给银行扣钱异常', 403)
    } else {
      sendData(ctx, res, 'OK', '管理员给银行扣钱成功', 200)
    }
  }
}