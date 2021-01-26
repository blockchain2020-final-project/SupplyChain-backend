const { exportRtr } = require('../utils')
const AdministratorCtrl = require('../controllers/administrator')

const Router = require("koa-express-router");
const router = new Router();
module.exports = exportRtr(router)

router.route('/sendcredit').post(AdministratorCtrl.sendCreditPointToBank)
router.route('/recyclecredit').post(AdministratorCtrl.recycleCreditFromBank)