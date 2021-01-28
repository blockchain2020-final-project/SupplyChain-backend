const { sendData } = require("../utils");

const { exportRtr } = require('../utils')
const BankCtrl = require('../controllers/bank')
const Router = require("koa-express-router");

const router = new Router();
module.exports = exportRtr(router)


router.route('').post(BankCtrl.createBank)
router.route('/sendcredit').post(BankCtrl.sendCreditToCoreCompany)
router.route('').get(BankCtrl.getAllBanks)
router.route('/:address/finances').get(BankCtrl.getFinancesRequest)
router.route('/:address/unsettledfinances').get(BankCtrl.getUnsettedFinancesRequest)
router.route('/:address').get(BankCtrl.getBankByAddress)
