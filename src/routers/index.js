const Router = require('koa-express-router')
const info = require('./info');
const accounts = require('./account')
const { sendData } = require('../utils');
const contract = require('./contract')
const block = require('./block')
const tx = require('./transaction')
const account = require('./account')
const adminRtr = require('./administrator')
const bankRtr = require('./bank');
const certRtr = require('./certifier')
const companyRtr = require('./company')
exports.default = function route (app) {
  const router = new Router({ prefix: '/api' })
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      console.log(err)
      err.status = err.statusCode || err.status || 500;
      ctx.body = err.message;
      sendData(ctx, err, 'ERROR', '发生异常', err.status)
    }
  });
  app.use(router.routes())
  router.use('/accounts', accounts)
  router.use('/administrater', adminRtr)
  router.use('/banks', bankRtr)
  router.use('/certifiers', certRtr)
  router.use('/companies', companyRtr)


  router.use('/', info)
  router.use('/contract', contract)
  router.use('/block', block)
  router.use('/transaction', tx)
  router.use('/account', account);


}