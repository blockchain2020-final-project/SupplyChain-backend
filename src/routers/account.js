const { exportRtr } = require('../utils')
const AccountRtr = require('../controllers/account')
const Router = require("koa-express-router");

const router = new Router();
module.exports = exportRtr(router)

router.route('/login').post(AccountRtr.login)



