const {
  Web3jService, Configuration, ConsensusService,
  SystemConfigService,
  CompileService,
} = require('../packages/api/index')
const fs = require('fs')

const { async } = require("rxjs");
const path = require('path')
const configFile = path.join(process.cwd(), 'src/packages/cli/conf/config.json');
const config = new Configuration(configFile);
const redis = require('../services/redis')

var contractName = ""
var contractAddress = ""

module.exports = {
  getAllAccounts: async () => {
    return config.accounts;
  },
  getContractName: () => {
    // if (contractName == "") {

    //   contractName = await redis.get("contractName")
    // }
    return "Supply0"
  },
  getContractAddress: async () => {
    if (contractAddress == '') {
      contractAddress = await redis.get("contractAddress")
    }
    return contractAddress
  },
  saveContractName: (name) => {
    redis.set('contractName', name)
    contractName = name
  },
  saveContractAddr: (addr) => {
    redis.set('contractAddress', addr)
    contractAddress = addr
  }

}