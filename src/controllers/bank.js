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
   * @apiParam {String} company_address  
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
    const { company_address, amount } = ctx.request.body
    const res = await call({
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "creditDistributionToCore",
      parameters: [address, company_address, amount]
    })
    sendData(ctx, res, 'OK', "发放信用点成功", 200)
  },

  /**
   * @api {get} /banks 获取全部银行
   * @apiGroup Bank
   * @apiSuccess {String} msg 结果描述
   * @apiSuccess {Number} code 状态码
   * @apiSuccess {Object[]} data 银行数组，下面是每个银行包含的属性
   * @apiSuccess {String} data.addr 地址
   * @apiSuccess {String} data.name 名字
   * @apiSuccess {Number} data.creditAmount 信用点余额
   * @apiSuccess {Number} data.cashAmount 现金余额
   * @apiSuccess {Number} data.cType
   */
  getAllBanks: async (ctx, next) => {
    let ca = await AccountServ.getContractAddress()
    const res = await call({
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "getAllBank",
      parameters: []
    })
    console.log("banks: ", res.output.result[0])
    addrs = res.output.result[0]
    let i = 0
    let ret = []
    for (i = 0; i < addrs.length; i++) {
      addr = addrs[i];
      const temp = await call({
        contractAddress: ca,
        contractName: AccountServ.getContractName(),
        function: "getBank",
        parameters: [addr]
      })
      const bank = temp.output.result[0]
      console.log(temp.output.result[0])
      ret.push(bank)
    }
    sendData(ctx, ret, 'OK', "获取全部银行成功", 200)
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
   * @api {get} /banks/:address/finances 银行获取全部贷款请求
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
    let addr = ctx.params.address
    const res = await call({
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "getAllFinanceRequest",
      parameters: [addr]
    })
    console.log(res)
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
    sendData(ctx, ret, 'OK', "获取全部贷款信息成功", 200)
  },

  /**
 * @api {get} /banks/:address/unsettledfinances 银行获取全部未结束的贷款请求
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
  getUnsettedFinancesRequest: async (ctx, next) => {
    let ca = await AccountServ.getContractAddress()
    let addr = ctx.params.address
    const res = await call({
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "getAllUnsettedFinance",
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
    sendData(ctx, ret, 'OK', "获取全部未结算的贷款信息成功", 200)

  },

  /**
   * @api {post} /banks/financerespond 银行响应公司的贷款
   * @apiGroup Bank
   * @apiParam {String} senderAddr  银行地址
   * @apiParam {String} payerAddr   付款人信息
   * @apiParam {Number} financeId
   * @apiParam {Number} respond    1 为接受，2为拒绝
   */
  financeRespond: async (ctx, next) => {
    let ca = await AccountServ.getContractAddress()
    const { senderAddr, payerAddr, financeId, respond } = ctx.request.body
    const res = await call({
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "financeRespond",
      parameters: [senderAddr, payerAddr, financeId, respond]
    })
    if (res.output != undefined && res.output.error != []) {
      sendData(ctx, res.output.error, 'ERROR', '银行响应公司的贷款失败', 403)
    } else {
      sendData(ctx, res, 'OK', '银行响应公司的贷款成功', 200)
    }
  },

  /**
   * @api {post} /banks/deposite 银行给公司发钱
   * @apiGroup Bank
   * @apiParam {String} companyAddr 公司地址
   * @apiParam {String} amount 钱数
   */
  depositeMoney: async (ctx, next) => {
    const addr = ctx.cookies.get('addr')
    let ca = await AccountServ.getContractAddress()
    const { companyAddr, amount } = ctx.request.body
    const res = await call({
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "depositCash",
      parameters: [addr, companyAddr, amount]
    })
    if (res.output != undefined && res.output.error != []) {
      sendData(ctx, res.output.error, 'ERROR', '银行给公司发钱异常', 403)
    } else {
      sendData(ctx, res, 'OK', '银行给公司发钱成功', 200)
    }
  },

  /**
   * @api {post} /banks/withdraw 银行给公司扣钱
   * @apiGroup Bank
   * @apiParam {String} companyAddr 公司地址
   * @apiParam {String} amount
   */
  withdrawMoney: async (ctx, next) => {
    const addr = ctx.cookies.get('addr')
    let ca = await AccountServ.getContractAddress()
    const { companyAddr, amount } = ctx.request.body
    const res = await call({
      contractAddress: ca,
      contractName: AccountServ.getContractName(),
      function: "withdrawCash",
      parameters: [addr, companyAddr, amount]
    })
    if (res.output != undefined && res.output.error != []) {
      sendData(ctx, res.output.error, 'ERROR', '银行给公司扣钱异常', 403)
    } else {
      sendData(ctx, res, 'OK', '银行给公司扣钱成功', 200)
    }
  }


}