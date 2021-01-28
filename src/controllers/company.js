const { sendData } = require("../utils");
const { call } = require("../services/api");
const AccountServ = require("../services/account");
const { async } = require("rxjs");


module.exports = {
  /**
   * @api {post} /companies 注册普通企业, 如果已经存在，则注册为核心企业
   * @apiName 企业注册(当前用户必须是监管机构)
   * @apiGroup Company
   * @apiParam {String} company_address
   * @apiParam {String} company_name
   * @apiSuccess {String} msg 结果描述
   * @apiSuccess {Number} code 状态码 200是成功，403是无权限
   * @apiSuccess {Object[]} data 数据
   */
  createCompany: async (ctx, next) => {
    const type = ctx.cookies.get('type')
    const addr = ctx.cookies.get('addr')
    let ca = await AccountServ.getContractAddress()
    const { company_address, company_name } = ctx.request.body
    let res = await call({
      // TODO: finish the storage of contract
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "registerCompany",
      parameters: [addr, company_address, company_name]
    })
    sendData(ctx, res, 'OK', "注册企业成功", 200)
  },

  /**
   * @api {get} /companies 获取全部普通企业
   * @apiGroup Company
   * @apiSuccess {Object[]} data
   * @apiSuccess {String} data.addr 地址
   * @apiSuccess {String} data.name 名字
   * @apiSuccess {Number} data.creditAmount 信用点余额
   * @apiSuccess {Number} data.cashAmount 现金余额
   * @apiSuccess {Number} data.cType
   * @apiSuccess {Number} code 状态码 200是成功
   * @apiSuccess {Object[]} data 数据
   */
  getAllCompanies: async (ctx, next) => {
    let ca = await AccountServ.getContractAddress()
    const res = await call({
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "getAllNormalCompany",
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
        function: "getCompany",
        parameters: [addr]
      })
      const bank = temp.output.result[0]
      console.log(temp.output.result[0])
      ret.push(bank)
    }
    sendData(ctx, ret, 'OK', '获取全部普通企业成功', 200)
  },
  /**
   * @api {get} /companies/:addr 根据地址获取普通企业
   * @apiGroup Company
   * @apiSuccess {Object[]} data
   * @apiSuccess {String} data.addr 地址
   * @apiSuccess {String} data.name 名字
   * @apiSuccess {Number} data.creditAmount 信用点余额
   * @apiSuccess {Number} data.cashAmount 现金余额
   * @apiSuccess {Number} data.cType
   * @apiSuccess {Number} code 状态码 200是成功
   * @apiSuccess {Object[]} data 数据
   */
  getCompanyByAddress: async (ctx, next) => {
    const addr = ctx.params.address
    let ca = await AccountServ.getContractAddress()
    const res = await call({
      // TODO: finish the storage of contract
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "getNormalCompany",
      parameters: [addr]
    })
    sendData(ctx, res.output.result, 'OK', '根据地址获取企业信息成功', 200)
  },

  /**
 * @api {get} /companies/:addr/transactions 获取某个普通企业作为收款方的全部交易
 * @apiGroup Company
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
  getCompanyTransactions: async (ctx, next) => {
    const addr = ctx.params.address
    let ca = await AccountServ.getContractAddress()
    const res = await call({
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "getAllTransactionRequest",
      parameters: [addr]
    })
    addrs = res.output.result[0]
    let i = 0
    let ret = []
    for (i = 0; i < addrs.length; i++) {
      let t = addrs[i];
      const temp = await call({
        contractAddress: ca,
        contractName: AccountServ.getContractName(),
        function: "getTransaction",
        parameters: [addr, t]
      })
      const bank = temp.output.result[0]
      console.log(temp.output.result[0])
      ret.push(bank)
    }
    sendData(ctx, res.output.result, 'OK', '查询所有以某公司为收款方的未还清的交易账单成功', 200)
  },

  /** 
   * @api {get} /companies/:addr/receipts 获取某个普通企业为收款方的未还清的交易账单
   * @apiGroup Company
   * @apiSuccess {Object[]} data 未还清的交易账单
   * @apiSuccess {Number} data.id
   * @apiSuccess {String} data.payeeAddr
   * @apiSuccess {String} data.payerAddr
   * @apiSuccess {Number} data.paidAmount
   * @apiSuccess {Number} data.oriAmount
   * @apiSuccess {Number} data.createTime
   * @apiSuccess {Number} data.deadline
   * @apiSuccess {Number} data.receiptStatus
   * @apiSuccess {String} data.bankSignature
   * @apiSuccess {String} data.coreCompanySignature
   * @apiSuccess {String} data.info
   * @apiSuccess {Number} data.isFinance
   * @apiSuccess {Number} code 状态码 200是成功
  */
  getCompanyReceipts: async (ctx, next) => {
    const addr = ctx.params.address
    let ca = await AccountServ.getContractAddress()
    const res = await call({
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "getAllUnsettedReceipt",
      parameters: [addr]
    })
    sendData(ctx, res.output.result, 'OK', '查询所有以某公司为收款方的未还清的交易账单成功', 200)
  },

  /**
   * @api {post} /companies/transactions_new 发起一笔交易, 创建新的应收款账单
   * @apiGroup Company
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
   * @api {post} /companies/transactions_old 发起一笔交易，使用已有的应收账款单
   * @apiGroup Company
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
   * @api {post} /companies/finances 发起贷款请求
   * @apiGroup Company
   * @apiParam {String} payeeAddr
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
}