pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

contract StageOne {
    /** struct defination **/
    struct Company {
        // 公司名
        string name;
        // 公司地址，哈希值(在后端通过 get_account.sh 生成)
        address _addr;
    }

    struct Bank {
        // 银行名
        string name;
        // 银行地址，哈希值
        address _addr;
    }
    /** ----------------- **/

    /** global variables defination **/

    // 全部银行的集合
    Bank[] banks;

    // 全部公司的集合
    Company[] companies;

    /** ----------------- **/

    /** methods defination **/
    // 根据银行地址获取银行的信息
    function getBank(address bankAddress) public view returns (string) {
        Bank storage bank;
        for (uint256 i = 0; i < banks.length; i++) {
            if (bankAddress == banks[i]._addr) {
                bank = banks[i];
                break;
            }
        }
        return (bank.name);
    }

    // 根据公司地址获取公司信息
    function getCompany(address companyAddress) public view returns (string) {
        Company storage comp;
        for (uint256 i = 0; i < companies.length; i++) {
            if (companyAddress == companies[i]._addr) {
                comp = companies[i];
                break;
            }
        }
        return (comp.name);
    }

    // 注册一家银行
    function registerBank(address bankAddress, string name)
        public
        returns (bool success)
    {
        banks.push(Bank(name, bankAddress));
        return true;
    }

    // 注册一家公司
    function registerCompany(address companyAddress, string name)
        public
        returns (bool success)
    {
        companies.push(Company(name, companyAddress));
        return true;
    }

    // 获取所有银行
    function getAllBanks()
        public
        returns (address[] addresses, string[] names)
    {
        addresses = new address[](uint256(banks.length));
        names = new string[](uint256(banks.length));
        for (uint256 i = 0; i < banks.length; i++) {
            addresses[i] = banks[i]._addr;
            names[i] = banks[i].name;
        }
        return (addresses, names);
    }

    // 获取所有公司
    function getAllCompanies()
        public
        returns (address[] addresses, string[] names)
    {
        addresses = new address[](uint256(companies.length));
        names = new string[](uint256(companies.length));
        for (uint256 i = 0; i < companies.length; i++) {
            addresses[i] = companies[i]._addr;
            names[i] = companies[i].name;
        }
        return (addresses, names);
    }
    /** --------------- **/
}
