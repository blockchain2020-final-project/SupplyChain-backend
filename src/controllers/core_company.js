const { sendData } = require("../utils");
const { async } = require("rxjs");

module.exports = {

  /**
   * @api {patch} /companies 注册核心企业
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
    const { company_address, company_name } = ctx.request.body
    if (type != "certifier") {
      sendData(ctx, {}, 'UNAUTHORIZED', '您没有监管机构权限', 403)
    }
    const res = await call({
      // TODO: finish the storage of contract
      contractAddress: AccountServ.getContractAddress(),
      contractName: AccountServ.getContractName(),
      function: "registerCoreCompany",
      parameters: [company_address, company_name]
    })
    sendData(ctx, res, 'OK', "注册企业成功", 200)
  },
  /**
    * @api {get} /core_companies 获取全部核心企业
    * @apiGroup CoreCompany
    * @apiSuccess {Object[]} data  核心企业数组
    * @apiSuccess {String} data.addr   企业地址
    * @apiSuccess {String} data.name   企业名称
    * @apiSuccess {Number} data.cType  企业类型
    * @apiSuccess {Number} data.inCredit   该企业分配得到的信用点
    * @apiSuccess {Number} data.outCredit  该企业发放的信用点
    * @apiSuccess {Number} code 状态码
    *
    */
  getAllCoreCompanies: async (ctx, next) => {

  },
  /**
   * @api {get} /core_companies/:addr 根据地址获取核心企业
   * @apiGroup CoreCompany
   * @apiSuccess {Object[]} data 核心企业数组，仅有一个元素
   * @apiSuccess {String} data.addr   企业地址
   * @apiSuccess {String} data.name   企业名称
   * @apiSuccess {Number} data.cType  企业类型  
   * @apiSuccess {Number} data.inCredit   该企业分配得到的信用点
   * @apiSuccess {Number} data.outCredit  该企业发放的信用点
   * @apiSuccess {Number} code 状态码
   */
  getCoreCompanyByAddress: async (ctx, next) => {

  },

  /**
   * @api {get} /core_companies/:addr/transactions 获取某个核心企业的全部交易
   * @apiGroup CoreCompany
   * @apiSuccess {Object[]} data 交易
   * @apiSuccess {String} data.id
   * @apiSuccess {String} data.sellerAddr
   * @apiSuccess {String} data.buyerAddr
   * @apiSuccess {Number} data.amount
   * @apiSuccess {Number} data.createTime
   * @apiSuccess {Number} data.tMode 交易模式
   * @apiSuccess {String} data.oriReceiptId  相关的贷款单？还不确定是不是这个意思
   * @apiSuccess {Number} data.requestStatus
   */
  getCoreCompanyTransaction: async (ctx, next) => {

  },

  /**
   * @api {post} /core_companies/:addr/transactions 发起一笔交易
   * @apiGroup CoreCompany
   * @apiParam {String} sellerAddr // 对方的地址
   * @apiParam {Number} amount
   * @apiParam {Number} deadline
   * @apiParam {Number} tMode
   * @apiParam {String} oriReceiptId
   */
  transactionRequest: async (ctx, next) => {

  }

}