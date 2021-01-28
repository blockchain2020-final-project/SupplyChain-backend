const { exportRtr } = require('../utils')
const AdministratorCtrl = require('../controllers/administrator')

const Router = require("koa-express-router");
const router = new Router();
module.exports = exportRtr(router)

router.route('').get(AdministratorCtrl.getAdmins)
router.route('/:address').get(AdministratorCtrl.getAdministratorInfoByAddress)
router.route('/sendcredit').post(AdministratorCtrl.sendCreditPointToBank)
router.route('/recyclecredit').post(AdministratorCtrl.recycleCreditFromBank)
router.route('/deposite').post(AdministratorCtrl.depositeMoney)
router.route('/withdraw').post(AdministratorCtrl.withdrawMoney)