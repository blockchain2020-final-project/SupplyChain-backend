const { exportRtr } = require('../utils')
const Router = require("koa-express-router");
const CompanyCtrl = require('../controllers/company');
const company = require('../controllers/company');
const router = new Router();
module.exports = exportRtr(router)

router.route('').post(CompanyCtrl.createCompany)
router.route('').patch(CompanyCtrl.registerCoreCompany)
router.route('').get(CompanyCtrl.getAllCompanies)
router.route('/:addr').get(CompanyCtrl.getCompanyByAddress)
router.route('/:addr/transactions').get(CompanyCtrl.getCompanyTransactions)

