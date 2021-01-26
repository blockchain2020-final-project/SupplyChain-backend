const { async } = require("rxjs");
const { deploy, call, getAllContract } = require("../services/api");
const { sendData } = require("../utils");


module.exports = {
  deploy: async (ctx, next) => {
    const { contract, parameters } = ctx.request.body;
    let res = await deploy(contract, parameters)
    return sendData(ctx, res, 'OK', '部署成功', 200)
  },

  call: async (ctx, next) => {
    const argv = ctx.request.body;
    let res = await call(argv)
    return sendData(ctx, res, 'OK', '执行成功', 200)
  },

  getAllContract: async (ctx, next) => {
    const res = await getAllContract();
    return sendData(ctx, res, 'OK', '获取全部已经部署的合约成功', 200)
  }
}