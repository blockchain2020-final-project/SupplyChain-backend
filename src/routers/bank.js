const { sendData } = require("../utils");

const { exportRtr } = require('../utils')
const BankCtrl = require('../controllers/bank')
const Router = require("koa-express-router");

const router = new Router();
module.exports = exportRtr(router)


router.route('').post(BankCtrl.createBank)
router.route('/sendcredit').post(BankCtrl.sendCreditToCoreCompany)
