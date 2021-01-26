const { sendData } = require("../utils");
const { call } = require("../services/api");
const AccountServ = require("../services/account");
const { async } = require("rxjs");


module.exports = {
  /**
   * @api {post} /companies 注册普通企业
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
    const { company_address, company_name } = ctx.request.body
    if (type != "certifier") {
      sendData(ctx, {}, 'UNAUTHORIZED', '您没有监管机构权限', 403)
    }
    const res = await call({
      // TODO: finish the storage of contract
      contractAddress: AccountServ.getContractAddress(),
      contractName: AccountServ.getContractName(),
      function: "registerCompany",
      parameters: [company_address, company_name]
    })
    sendData(ctx, res, 'OK', "注册企业成功", 200)
  },

  /**
   * @api {get} /companies 获取全部普通企业
   * @apiGroup Company
   * @apiSuccess {Object[]} data
   * @apiSuccess {String} data.addr
   * @apiSuccess {String} data.name
   * @apiSuccess {Number} data.cType
   * @apiSuccess {Number} data.inCredit
   * @apiSuccess {Number} data.outCredit
   * @apiSuccess {Number} code 状态码 200是成功
   * @apiSuccess {Object[]} data 数据
   */
  getAllCompanies: async (ctx, next) => {

  },


  /**
   * @api {get} /companies/:addr 根据地址获取普通企业
   * @apiGroup Company
   * @apiSuccess {Object[]} data
   * @apiSuccess {String} data.addr
   * @apiSuccess {String} data.name
   * @apiSuccess {Number} data.cType
   * @apiSuccess {Number} data.inCredit
   * @apiSuccess {Number} data.outCredit
   * @apiSuccess {Number} code 状态码 200是成功
   * @apiSuccess {Object[]} data 数据
   */
  getCompanyByAddress: async (ctx, next) => {

  },

  /**
 * @api {get} /companies/:addr/transactions 获取某个普通企业的全部交易
 * @apiGroup Company
 * @apiSuccess {Object[]} data 交易
 * @apiSuccess {String} data.id
 * @apiSuccess {String} data.sellerAddr
 * @apiSuccess {String} data.buyerAddr
 * @apiSuccess {Number} data.amount
 * @apiSuccess {Number} data.createTime
 * @apiSuccess {Number} data.tMode 交易模式
 * @apiSuccess {String} data.oriReceiptId  相关的贷款单？还不确定是不是这个意思
 * @apiSuccess {Number} data.requestStatus
 * @apiSuccess {Number} code 状态码 200是成功
 * @apiSuccess {Object[]} data 数据
 */
  getCompanyTransactions: async (ctx, next) => {

  }

}