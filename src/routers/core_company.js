const { exportRtr } = require('../utils')
const Router = require("koa-express-router");
const CoreCompanyCtrl = require('../controllers/core_company')
const router = new Router();
module.exports = exportRtr(router)

router.route('').get(CoreCompanyCtrl.getAllCoreCompanies)
router.route('/:addr').get(CoreCompanyCtrl.getCoreCompanyByAddress)
router.route('/:addr/transactions').get(CoreCompanyCtrl.getCoreCompanyTransaction)
router.route('/:addr/transactions').post(CoreCompanyCtrl.transactionRequest)