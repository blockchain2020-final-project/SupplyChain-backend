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

var contractName = ""
var contractAddress = ""

module.exports = {
  getAllAccounts: async () => {
    return config.accounts;
  },
  getContractName: () => {
    // const data = fs.readFileSync(config.contractNameFile, 'utf8')
    // return data
    return contractName
  },
  getContractAddress: () => {
    // const data = fs.readFileSync(config.contractAddressFile, 'utf8')
    // return data
    return contractAddress
  },
  saveContractName: (name) => {
    fs.writeFileSync(config.contractNameFile, name)
    contractName = name
  },
  saveContractAddr: (addr) => {
    fs.writeFileSync(config.contractAddressFile, addr)
    contractAddress = addr
  }

}