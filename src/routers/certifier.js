const { exportRtr } = require("../utils")
const CertCtrl = require("../controllers/certifier")
const Router = require("koa-express-router");
const router = new Router();
module.exports = exportRtr(router)

router.route('').post(CertCtrl.createCertifier)