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
    const address = ctx.cookies.get('addr')
    const type = ctx.cookies.get('type')
    let ca = await AccountServ.getContractAddress()
    const { bank_address, bank_name } = ctx.request.body
    console.log([address, bank_address, bank_name])
    const res = await call({
      // TODO: finish the storage of contract
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "registerBank",
      parameters: [address, bank_address, bank_name]
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
    const address = ctx.cookies.get('addr')
    let ca = await AccountServ.getContractAddress()
    const { bank_address, amount } = ctx.request.body
    const res = await call({
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "creditDistributionToCore",
      parameters: [address, bank_address, amount]
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
    let ca = await AccountServ.getContractAddress()
    const res = await call({
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "getAllBank",
      parameters: []
    })
    sendData(ctx, res, 'OK', "获取全部银行成功", 200)
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
    const addr = ctx.params.address
    let ca = await AccountServ.getContractAddress()
    const res = await call({
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "getBank",
      parameters: [addr]
    })
    sendData(ctx, res.output.result, 'OK', "根据地址获取银行成功", 200)
  },

  /**
   * @api {get} /banks/finances 银行获取全部贷款请求
   * @apiGroup Bank
 * @apiSuccess {Object[]} data 贷款
 * @apiSuccess {Number} data.id
 * @apiSuccess {String} data.payeeAddr  修改字段
 * @apiSuccess {String} data.payerAddr  修改字段
 * @apiSuccess {Number} data.amount
 * @apiSuccess {Number} data.createTime
 * @apiSuccess {Number} data.tMode 
 * @apiSuccess {String} data.oriReceiptId 
 * @apiSuccess {Number} data.requestStatus
 * @apiSuccess {String} data.info 新增字段
 * @apiSuccess {Number} data.isFinance 新增字段，判断是否为贷款
 * @apiSuccess {Number} code 状态码 200是成功
   */
  getFinancesRequest: async (ctx, next) => {
    let ca = await AccountServ.getContractAddress()
    const res = await call({
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "getAllFinanceRequest",
      parameters: []
    })
    sendData(ctx, res, 'OK', '获取所有贷款请求成功', 200)
  }

}