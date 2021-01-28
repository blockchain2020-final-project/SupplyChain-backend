const { exportRtr } = require('../utils')
const Router = require("koa-express-router");
const CoreCompanyCtrl = require('../controllers/core_company')
const router = new Router();
module.exports = exportRtr(router)

router.route('').get(CoreCompanyCtrl.getAllCoreCompanies)
router.route('').post(CoreCompanyCtrl.registerCoreCompany)
router.route('/finances').post(CoreCompanyCtrl.financeRequest)
router.route('/transactions_new').post(CoreCompanyCtrl.transactionRequestWithNewReceipt)
router.route('/transactions_old').post(CoreCompanyCtrl.transactionRequestWithOldReceipt)
router.route('/transactionrespond').post(CoreCompanyCtrl.transactionRespond)
router.route('/payreceipt').post(CoreCompanyCtrl.payReceipt)
router.route('/:address').get(CoreCompanyCtrl.getCoreCompanyByAddress)
router.route('/:address/receipts').get(CoreCompanyCtrl.getCoreCompanysReceipts)
router.route('/:address/transactions').get(CoreCompanyCtrl.getCoreCompanyTransaction)
// router.route('/:address/finances').get(CoreCompanyCtrl.getCoreCompanyFinance)
router.route('/:address/unsettledreceipts').get(CoreCompanyCtrl.getCompanyUnsettledReceipts)
router.route('/:address/unpaidreceipts').get(CoreCompanyCtrl.getCompanyUnpaidReceipts)