const { exportRtr } = require('../utils')
const Router = require("koa-express-router");
const CompanyCtrl = require('../controllers/company');
const company = require('../controllers/company');
const router = new Router();
module.exports = exportRtr(router)

router.route('').post(CompanyCtrl.createCompany)
router.route('').get(CompanyCtrl.getAllCompanies)

router.route('/finances').post(CompanyCtrl.financeRequest)
router.route('/transactions_new').post(CompanyCtrl.transactionRequestWithNewReceipt)
router.route('/transactions_old').post(CompanyCtrl.transactionRequestWithOldReceipt)
router.route('transactionrespond').post(CompanyCtrl.transactionRespond)
router.route('/payreceipt').post(CompanyCtrl.payReceipt)
router.route('/:address').get(CompanyCtrl.getCompanyByAddress)
router.route('/:address/transactions').get(CompanyCtrl.getCompanyTransactions)
router.route('/:address/unsettledreceipts').get(CompanyCtrl.getCompanyUnsettledReceipts)
router.route('/:address/unpaidreceipts').get(CompanyCtrl.getCompanyUnpaidReceipts)
