const { exportRtr } = require('../utils')
const Router = require("koa-express-router");
const CoreCompanyCtrl = require('../controllers/core_company')
const router = new Router();
module.exports = exportRtr(router)

router.route('').get(CoreCompanyCtrl.getAllCoreCompanies)
router.route('/:address').get(CoreCompanyCtrl.getCoreCompanyByAddress)
router.route('/:address/receipts').get(CoreCompanyCtrl.getCoreCompanysReceipts)
router.route('/:address/transactions').get(CoreCompanyCtrl.getCoreCompanyTransaction)
router.route('/transactions_new').post(CoreCompanyCtrl.transactionRequestWithNewReceipt)
router.route('/transactions_old').post(CoreCompanyCtrl.transactionRequestWithOldReceipt)
router.route('/:address/finances').get(CoreCompanyCtrl.getCoreCompanyFinance)
router.route('/finances').post(CoreCompanyCtrl.financeRequest)