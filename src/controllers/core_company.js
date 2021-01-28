const { sendData } = require("../utils");
const { async } = require("rxjs");
const { call } = require("../services/api");
const AccountServ = require("../services/account")
module.exports = {


  /**
    * @api {get} /core_companies 获取全部核心企业
    * @apiGroup CoreCompany
    * @apiSuccess {Object[]} data  核心企业数组
   * @apiSuccess {String} data.addr 地址
   * @apiSuccess {String} data.name 名字
   * @apiSuccess {Number} data.creditAmount 信用点余额
   * @apiSuccess {Number} data.cashAmount 现金余额
   * @apiSuccess {Number} data.cType
    * @apiSuccess {Number} code 状态码
    *
    */
  getAllCoreCompanies: async (ctx, next) => {
    let ca = await AccountServ.getContractAddress()
    const res = await call({
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "getAllCoreCompany",
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
        function: "getCoreCompany",
        parameters: [addr]
      })
      const bank = temp.output.result[0]
      console.log(temp.output.result[0])
      ret.push(bank)
    }
    sendData(ctx, ret, 'OK', '获取全部核心企业成功', 200)
  },
  /**
   * @api {get} /core_companies/:addr 根据地址获取核心企业
   * @apiGroup CoreCompany
   * @apiSuccess {Object[]} data 核心企业数组，仅有一个元素
   * @apiSuccess {String} data.addr 地址
   * @apiSuccess {String} data.name 名字
   * @apiSuccess {Number} data.creditAmount 信用点余额
   * @apiSuccess {Number} data.cashAmount 现金余额
   * @apiSuccess {Number} data.cType
   * @apiSuccess {Number} code 状态码
   */
  getCoreCompanyByAddress: async (ctx, next) => {
    const addr = ctx.params.address
    let ca = await AccountServ.getContractAddress()
    const res = await call({
      // TODO: finish the storage of contract
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "getCoreCompany",
      parameters: [addr]
    })
    sendData(ctx, res.output.result, 'OK', '根据地址获取企业信息成功', 200)
  },

  /**
   * @api {get} /core_companies/:addr/transactions 获取某个核心企业为收款方的交易
   * @apiGroup CoreCompany
 * @apiSuccess {Object[]} data 交易
 * @apiSuccess {Number} data.id
 * @apiSuccess {String} data.payeeAddr  修改字段
 * @apiSuccess {String} data.payerAddr  修改字段
 * @apiSuccess {Number} data.amount
 * @apiSuccess {Number} data.createTime
 * @apiSuccess {Number} data.tMode 交易模式
 * @apiSuccess {String} data.oriReceiptId 
 * @apiSuccess {Number} data.requestStatus
 * @apiSuccess {String} data.info 新增字段
 * @apiSuccess {Number} data.isFinance 新增字段，判断是否为贷款
 * @apiSuccess {Number} code 状态码 200是成功
   */
  getCoreCompanyTransaction: async (ctx, next) => {
    const addr = ctx.params.address
    let ca = await AccountServ.getContractAddress()
    const res = await call({
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "getAllTransactionRequest",
      parameters: [addr]
    })
    sendData(ctx, res.output.result, 'OK', '查询所有以某公司为收款方的交易成功', 200)
  },

  /**
   * @api {get} /core_companies/:addr/finances 获取某个核心企业的全部贷款
   * @apiGroup CoreCompany
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
  getCoreCompanyFinance: async (ctx, next) => {
    const addr = ctx.params.address
    let ca = await AccountServ.getContractAddress()
    const res = await call({
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "",
      parameters: [addr]
    })
    sendData(ctx, res, 'OK', '查询核心企业发起的所有贷款成功', 200)
  },



  /**
   * @api {post} /core_companies/transactions_new 发起一笔交易, 创建新的应收款账单
   * @apiGroup CoreCompany
   * @apiParam {String} payeeAddr // 对方的地址
   * @apiParam {Number} amount    
   * @apiParam {Number} deadline
   * @apiParam {String} info
   */
  transactionRequestWithNewReceipt: async (ctx, next) => {
    const sender_address = ctx.cookies.get('addr')
    let ca = await AccountServ.getContractAddress()
    const { payeeAddr, amount, deadline, info } = ctx.request.body
    const res = await call({
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "transactionRequestWithNewReceipt",
      parameters: [sender_address, payeeAddr, amount, deadline, info]
    })
    if (res.output.error != [] && res.output.error != undefined) {
      sendData(ctx, res.output.error, 'ERROR', '异常', 403)
    } else {
      sendData(ctx, res, 'OK', '发起交易，创建新的应收账款单成功', 200)
    }
  },

  /**
   * @api {post} /core_companies/transactions_old 发起一笔交易，使用已有的应收账款单
   * @apiGroup CoreCompany
   * @apiParam {String} payeeAddr
   * @apiParam {Number} amount
   * @apiParam {Number} deadline
   * @apiParam {Number} oriReceiptId
   * @apiParam {String} info
   */
  transactionRequestWithOldReceipt: async (ctx, next) => {
    const sender_address = ctx.cookies.get('addr')
    let ca = await AccountServ.getContractAddress()
    const { payeeAddr, amount, deadline, info, oriReceiptId } = ctx.request.body
    const res = await call({
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "transactionRequestWithOldReceipt",
      parameters: [sender_address, payeeAddr, amount, deadline, oriReceiptId, info]
    })
    if (res.output.error != [] && res.output.error != undefined) {
      sendData(ctx, res.output.error, 'ERROR', '异常', 403)
    } else {
      sendData(ctx, res, 'OK', '创建新的应收账款单成功', 200)
    }
  },

  /**
   * @api {post} /core_companies/finances 发起贷款请求
   * @apiGroup CoreCompany
   * @apiParam {Number} amount
   * @apiParam {Number} deadline
   * @apiParam {Number} oriReceiptId
   * @apiParam {String} info
   */
  financeRequest: async (ctx, next) => {
    const sender_address = ctx.cookies.get('addr')
    let ca = await AccountServ.getContractAddress()
    const { payeeAddr, amount, deadline, oriReceiptId, info } = ctx.request.body
    const res = await call({
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "financeRequest",
      parameters: [sender_address, payeeAddr, amount, deadline, oriReceiptId, info]
    })
    if (res.output.error != [] && res.output.error != undefined) {
      sendData(ctx, res.output.error, 'ERROR', '异常', 403)
    } else {
      sendData(ctx, res, 'OK', '普通企业发起贷款请求成功', 200)
    }
  },

  /**
   * @api {get} /core_companies/:addr/receipts 获取核心企业为收款方的，没有还清的应收账款单
   * @apiGroup CoreCompany
   * @apiSuccess {String} msg 结果描述
   * @apiSuccess {Number} code 状态码
   * @apiSuccess {Object[]} data 所有应收账款单数组
   * @apiSuccess {String} data.id 
   * @apiSuccess {String} data.payeeAddr
   * @apiSuccess {String} data.payerAddr
   * @apiSuccess {Number} data.paidAmount    还了多少钱
   * @apiSuccess {Number} data.oriAmount    总共要换多少钱
   * @apiSuccess {Number} data.createTime
   * @apiSuccess {Number} data.deadline
   * @apiSuccess {Number} data.receiptStatus  0 为还没还清；1为已经还清
   * @apiSuccess {String} data.bankSignature
   * @apiSuccess {String} data.coreCompanySignature
   * @apiSuccess {String} data.info
   * @apiSuccess {Number} data.isFinance
   */
  getCoreCompanysReceipts: async (ctx, next) => {
    const addr = ctx.params.address
    let ca = await AccountServ.getContractAddress()

    const res = await call({
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "getAllUnsettedReceipt",
      parameters: [addr]
    })
    sendData(ctx, res.output.result, 'OK', '获取核心企业所有应收款账单成功', 200)
  },
  /**
* @api {post} /core_companies 注册核心企业
* @apiName 普通企业提升为核心企业
* @apiGroup CoreCompany
* @apiParam {String} company_address
* @apiParam {String} company_name
* @apiSuccess {String} msg 结果描述
* @apiSuccess {Number} code 状态码 200是成功，403是无权限
* @apiSuccess {Object[]} data 数据
*/
  registerCoreCompany: async (ctx, next) => {
    const type = ctx.cookies.get('type')
    let sender_address = ctx.cookies.get('addr')
    let ca = await AccountServ.getContractAddress()
    const { company_address, company_name } = ctx.request.body
    let res = await call({
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "registerCompany",
      parameters: [sender_address, company_address, company_name]
    })
    res = await call({
      // TODO: finish the storage of contract
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "registerCoreCompany",
      parameters: [sender_address, company_address]
    })
    sendData(ctx, res, 'OK', "注册核心企业成功", 200)
  },

}