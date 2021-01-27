const { sendData } = require("../utils");
const { async } = require("rxjs");

module.exports = {


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
   * @api {post} /core_companies/transactions 发起一笔交易
   * @apiGroup CoreCompany
   * @apiParam {String} sellerAddr // 对方的地址
   * @apiParam {Number} amount
   * @apiParam {Number} deadline
   * @apiParam {Number} tMode
   * @apiParam {String} oriReceiptId
   */
  transactionRequest: async (ctx, next) => {

  },

  /**
   * @api {get} /core_companies/:addr/receipts 获取核心企业的相关应收账款单
   * @apiGroup CoreCompany
   * @apiSuccess {String} msg 结果描述
   * @apiSuccess {Number} code 状态码
   * @apiSuccess {Object[]} data 所有应收账款单数组
   * @apiSuccess {String} data.id 
   * @apiSuccess {String} data.debtorAddr
   * @apiSuccess {String} data.debteeAddr
   * @apiSuccess {Number} data.curAmount    还了多少钱
   * @apiSuccess {Number} data.oriAmount    总共要换多少钱
   * @apiSuccess {Number} data.createTime
   * @apiSuccess {Number} data.deadline
   * @apiSuccess {String} data.bankSignature
   * @apiSuccess {String} data.coreCompanySignature
   */
  getCoreCompanysReceipts: async (ctx, next) => {

  }

}