const { sendData } = require("../utils");
const { call } = require("../services/api");
const { async } = require("rxjs");
const AccountServ = require("../services/account")

module.exports = {
  /**
     * @api {post} /banks 注册银行
     * @apiName 银行注册(当前用户必须是管理员)
     * @apiGroup Bank 
     * @apiParam {String} bank_address 银行地址，一串哈希值，0x开头，总长度(包含0x)为42，例如(0x27a28f09ec7accce2eecc27ebcd9453226ed3e52)
     * @apiParam {String} bank_name 银行名称
     * @apiSuccess {String} msg 结果描述
     * @apiSuccess {Number} code 状态码 200是成功，403是无权限
     * @apiSuccess {Object[]} data 数据
     */
  createBank: async (ctx, next) => {
    const address = ctx.cookies.get('address')
    const type = ctx.cookies.get('type')
    const { bank_address, bank_name } = ctx.request.body
    if (type != "administrator") {
      sendData(ctx, {}, 'UNAUTHORIZED', '您没有管理员权限', 403)
    }
    const res = await call({
      // TODO: finish the storage of contract
      contractAddress: AccountServ.getContractAddress(),
      contractName: AccountServ.getContractName(),
      function: "registerBank",
      parameters: [bank_address, bank_name]
    })
    sendData(ctx, res, 'OK', "注册银行成功", 200)
  },



  /**
   * @api {post} /banks/sendcredit 银行发送信用点给核心企业
   * @apiGroup Bank
   * @apiParam {String} bank_address  
   * @apiParam {Number} amount      要发放的信用点数量
   * @apiSuccess {String} msg 结果描述
   * @apiSuccess {Number} code 状态码
   * @apiSuccess {Object[]} data
   * 
   */
  sendCreditToCoreCompany: async (ctx, next) => {
    const type = ctx.cookies.get('type')
    if (type != "bank") {
      sendData(ctx, {}, 'UNAUTHORIZED', '您没有银行权限', 403)
    }
    const { bank_address, amount } = ctx.request.body
    const res = await call({
      contractAddress: AccountServ.getContractAddress(),
      contractName: AccountServ.getContractName(),
      function: "creditDistributionToCore",
      parameters: [bank_address, amount]
    })
    sendData(ctx, res, 'OK', "发放信用点成功", 200)
  },

  /**
   * @api {get} /banks 获取全部银行
   * @apiGroup Bank
   * @apiSuccess {String} msg 结果描述
   * @apiSuccess {Number} code 状态码
   * @apiSuccess {Object[]} data 银行数组，下面是每个银行包含的属性
   * @apiSuccess {String} data.addr 银行地址
   * @apiSuccess {String} data.name 名字
   * @apiSuccess {Number} data.inCredit 得到的信用点数
   * @apiSuccess {Number} data.outCredit 发放出去的总信用点
   */
  getAllBanks: async (ctx, next) => {

  },

  /**
   * @api {get} /banks/:addr 根据地址获取银行
   * @apiGroup Bank
   * @apiSuccess {String} msg 结果描述
   * @apiSuccess {Number} code 状态码
   * @apiSuccess {Object[]} data 银行数组，仅有一个元素
   * @apiSuccess {String} data.addr 银行地址
   * @apiSuccess {String} data.name 名字
   * @apiSuccess {Number} data.inCredit 得到的信用点数
   * @apiSuccess {Number} data.outCredit 发放出去的总信用点
   */
  getBankByAddress: async (ctx, next) => {

  },

  /**
   * @api {get} /banks/:addr/receipts 根据地址获取所有的贷款
   * @apiGroup Bank
   * @apiSuccess {String} msg 结果描述
   * @apiSuccess {Number} code 状态码
   * @apiSuccess {Object[]} data 所有贷款单数组
   * @apiSuccess {String} data.id 
   * @apiSuccess {String} data.debtorAddr
   * @apiSuccess {String} data.debteeAddr
   * @apiSuccess {Number} data.curAmount
   * @apiSuccess {Number} data.oriAmount
   * @apiSuccess {Number} data.createTime
   * @apiSuccess {Number} data.deadline
   * @apiSuccess {String} bankSignature
   * @apiSuccess {String} coreCompanySignature
   */
  getBankReceipts: async (ctx, next) => {

  }



}