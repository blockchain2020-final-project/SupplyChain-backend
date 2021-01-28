const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const { default: route } = require('./routers')
const logger = require('./utils/logger')
const cors = require('@koa/cors')
const app = new Koa()

app.use(cors({
  origin: 'http://localhost:8080',    // 前端地址
  credentials: true
}));
app.use(cors({
  origin: function () {
    return 'http://localhost:8080';
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE', 'PATCH'], //设置允许的HTTP请求类型
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
// app.use(async (ctx, next) => {
//   ctx.set('Access-Control-Allow-Origin', '*');
//   ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
//   ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
//   if (ctx.method == 'OPTIONS') {
//     ctx.body = 200;
//   } else {
//     await next();
//   }
// });
app.use(bodyParser())
app.use(logger)
route(app)
app.listen(3000)
console.log('blockchain-backend listening at port 3000')