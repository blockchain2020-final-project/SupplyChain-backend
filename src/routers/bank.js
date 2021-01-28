const { sendData } = require("../utils");

const { exportRtr } = require('../utils')
const BankCtrl = require('../controllers/bank')
const Router = require("koa-express-router");

const router = new Router();
module.exports = exportRtr(router)


router.route('').post(BankCtrl.createBank)
router.route('').get(BankCtrl.getAllBanks)
router.route('/deposite').post(BankCtrl.depositeMoney)
router.route('/withdraw').post(BankCtrl.withdrawMoney)
router.route('/sendcredit').post(BankCtrl.sendCreditToCoreCompany)
router.route('/financerespond').post(BankCtrl.financeRespond)
router.route('/:address').get(BankCtrl.getBankByAddress)
router.route('/:address/finances').get(BankCtrl.getFinancesRequest)
router.route('/:address/unsettledfinances').get(BankCtrl.getUnsettedFinancesRequest)
