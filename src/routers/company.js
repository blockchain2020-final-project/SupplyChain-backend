const { exportRtr } = require('../utils')
const Router = require("koa-express-router");
const CompanyCtrl = require('../controllers/company')
const router = new Router();
module.exports = exportRtr(router)

router.route('').post(CompanyCtrl.createCompany)
router.route('').patch(CompanyCtrl.registerCoreCompany)
