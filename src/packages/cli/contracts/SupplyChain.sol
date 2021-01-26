pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

contract SupplyChain {
    /** struct defination **/
    struct Message {
        bool success;
        string msg;
    }

    struct Company {
        // 公司名
        string name;
        // 公司地址，哈希值(在后端通过 get_account.sh 生成)
        address _addr;
        // 公司信用等级
        uint256 credit;
        // 公司资产
        uint256 asset;
    }

    struct Bank {
        // 银行名
        string name;
        // 银行地址，哈希值
        address _addr;
    }

    // 一笔应收账款单
    struct Bill {
        // 账单id
        uint256 bill_id;
        // 申请借钱的公司
        address borrow_company;
        // 借出钱的公司
        address lend_company;
        // 应收金额
        uint256 money;
        // 借款日期
        uint256 start_date;
        // 还款日期
        uint256 end_date;
        // 是否通过审核
        bool is_pass;
        // 是否还款
        bool is_finish;
        // 是否是核心企业的账单
        bool is_from_upstream;
        // 收款公司的信用评级变动
        uint256 credit_growth;
    }

    // 一笔向银行的融资
    struct Loan {
        // 融资账单id
        uint256 loan_id;
        // 申请融资的公司
        address request_company;
        // 银行地址
        address bank_address;
        // 发起日期
        uint256 start_date;
        // 还款日期
        uint256 end_date;
        // 是否通过审核
        bool is_pass;
        // 是否还款
        bool is_finish;
        // 融资金额
        uint256 money;
    }

    // 交易
    struct Deal {
        // 交易id
        uint256 deal_id;
        // 出钱的一方, 买家
        address buyer_company;
        // 出货的一方，卖家
        address seller_company;
        // 交易发起开始日期
        uint256 start_date;
        // 交易是否完成
        bool is_finish;
        // 购买商品描述
        string merchant;
        // 购买金额
        uint256 money;
    }

    // // 由公司地址到公司实体的映射
    // mapping(address => Company) addr2company;

    // 由公司地址到公司资产的映射
    mapping(address => uint256) assets;

    // 由公司地址到公司信用评级的映射
    mapping(address => uint256) credit_level;

    // 由公司地址到公司级别的映射, 表明该公司是否是核心企业
    mapping(address => bool) is_upstream;

    /** ----------------- **/

    /** global variables defination **/

    // 全部银行的集合
    Bank[] banks;

    // 全部公司的集合
    Company[] companies;

    // 所有账单的集合
    Bill[] bills;
    uint256 bill_id;

    // 所有融资的合集
    Loan[] loans;
    uint256 loan_id;

    // 所有交易的合集
    Deal[] deals;
    uint256 deal_id;

    /** ----------------- **/

    constructor() public {
        bill_id = 1;
        loan_id = 1;
        deal_id = 1;
    }

    /** methods defination **/
    // 根据银行地址获取银行的信息
    function getBankByAddress(address bankAddress)
        public
        view
        returns (Bank memory)
    {
        Bank memory bank;

        for (uint256 i = 0; i < banks.length; i++) {
            if (bankAddress == banks[i]._addr) {
                Bank storage temp = banks[i];
                bank = temp;
                break;
            }
        }
        return bank;
    }

    // 根据公司地址获取公司信息
    function getCompanyByAddress(address companyAddress)
        public
        view
        returns (Company memory)
    {
        Company memory comp;
        for (uint256 i = 0; i < companies.length; i++) {
            if (companyAddress == companies[i]._addr) {
                Company storage temp = companies[i];
                comp = temp;
                break;
            }
        }
        return comp;
    }

    // 返回该公司是否是上游企业
    function isCompanyUpstream(address companyAddress)
        public
        view
        returns (bool)
    {
        return is_upstream[companyAddress];
    }

    function setCompanyUpstream(address companyAddress)
        public
        view
        returns (bool)
    {
        is_upstream[companyAddress] = true;
        return true;
    }

    // 根据loan_id获取一笔贷款
    function getLoanById(uint256 lid) public view returns (Loan memory) {
        Loan memory loan;
        for (uint256 i = 0; i < loans.length; i++) {
            if (lid == loans[i].loan_id) {
                Loan storage l = loans[i];
                loan = l;
                break;
            }
        }

        return loan;
    }

    // 根据bill_id获取一笔贷款
    function getBillById(uint256 bid) public view returns (Bill memory) {
        Bill memory bill;
        for (uint256 i = 0; i < bills.length; i++) {
            if (bid == bills[i].bill_id) {
                Bill storage b = bills[i];
                bill = b;
                break;
            }
        }
        return bill;
    }

    // 根据 deal_id 获取一笔交易的内容
    function getDealById(uint256 did) public view returns (Deal memory) {
        Deal memory deal;
        for (uint256 i = 0; i < deals.length; i++) {
            if (did == deals[i].deal_id) {
                Deal storage d = deals[i];
                deal = d;
                break;
            }
        }
        return deal;
    }

    // 注册一家银行
    function registerBank(address bankAddress, string name)
        public
        returns (bool success)
    {
        banks.push(Bank(name, bankAddress));
        return true;
    }

    // 注册一家公司, 默认信用等级为0，资产为0，为非核心企业。需要后续的额外添加
    function registerCompany(address companyAddress, string name)
        public
        returns (bool success)
    {
        companies.push(Company(name, companyAddress, 0, 0));
        is_upstream[companyAddress] = false;
        return true;
    }

    // 注册公司资产
    function registerCompanyAsset(address companyAddress, uint256 money)
        public
        returns (bool success)
    {
        assets[companyAddress] = money;
        for (uint256 i = 0; i < companies.length; i++) {
            if (companies[i]._addr == companyAddress) {
                companies[i].asset = money;
            }
        }
        return true;
    }

    // 注册公司的信用等级
    function registerCompanyCreditLevel(address companyAddress, uint256 cl)
        public
        returns (bool success)
    {
        credit_level[companyAddress] = cl;
        for (uint256 i = 0; i < companies.length; i++) {
            if (companies[i]._addr == companyAddress) {
                companies[i].credit = cl;
            }
        }
        return true;
    }

    // 增加某公司的信用等级
    function addCreditLevel(address companyAddress, uint256 cl)
        public
        returns (bool success)
    {
        credit_level[companyAddress] += cl;
        for (uint256 i = 0; i < companies.length; i++) {
            if (companyAddress == companies[i]._addr) {
                companies[i].credit += cl;

                break;
            }
        }
        return true;
    }

    // 增加某公司的资产数量
    function addAsset(address companyAddress, uint256 ass)
        public
        returns (bool success)
    {
        assets[companyAddress] += ass;
        for (uint256 i = 0; i < companies.length; i++) {
            if (companyAddress == companies[i]._addr) {
                companies[i].asset += ass;

                break;
            }
        }
        return true;
    }

    // 减少某公司的资产数量
    function decreaseAsset(address companyAddress, uint256 ass)
        public
        returns (bool success)
    {
        assets[companyAddress] -= ass;
        for (uint256 i = 0; i < companies.length; i++) {
            if (companyAddress == companies[i]._addr) {
                companies[i].asset -= ass;

                break;
            }
        }
        return true;
    }

    // 获取所有银行
    function getAllBanks() public view returns (Bank[] memory) {
        Bank[] memory ret = new Bank[](banks.length);
        for (uint256 i = 0; i < banks.length; i++) {
            Bank storage temp = banks[i];
            ret[i] = temp;
        }
        return ret;
    }

    // 获取所有公司
    function getAllCompanies() public view returns (Company[] memory) {
        Company[] memory ret = new Company[](companies.length);
        for (uint256 i = 0; i < companies.length; i++) {
            Company storage temp = companies[i];
            ret[i] = temp;
        }
        return ret;
    }

    // 获取所有的融资
    function getAllLoans() public view returns (Loan[] memory) {
        Loan[] memory ret = new Loan[](loans.length);
        for (uint256 i = 0; i < loans.length; i++) {
            Loan storage temp = loans[i];
            ret[i] = temp;
        }
        return ret;
    }

    // 获取全部账单
    function getAllBills() public view returns (Bill[] memory) {
        Bill[] memory ret = new Bill[](bills.length);
        for (uint256 i = 0; i < bills.length; i++) {
            Bill storage temp = bills[i];
            ret[i] = temp;
        }
        return ret;
    }

    // 根据地址获取某个公司所有的作为lend_company的账单
    function getLendBillsByCompanyAddress(address companyAddress)
        public
        view
        returns (Bill[] memory)
    {
        uint256 len = bills.length;
        Bill[] memory ret = new Bill[](len);
        uint256 k = 0;
        for (uint256 i = 0; i < len; i++) {
            if (companyAddress == bills[i].lend_company) {
                ret[k++] = bills[i];
            }
        }
        return ret;
    }

    // 根据地址获取某个公司所有的作为borrow_company的账单
    function getBorrowBillsByComanyAddress(address companyAddress)
        public
        view
        returns (Bill[] memory)
    {
        uint256 len = bills.length;
        Bill[] memory ret = new Bill[](len);
        uint256 k = 0;
        for (uint256 i = 0; i < len; i++) {
            if (companyAddress == bills[i].borrow_company) {
                ret[k++] = bills[i];
            }
        }
        return ret;
    }

    // 根据地址获取某个公司的所有融资
    function getLoansByCompanyAddress(address companyAddress)
        public
        view
        returns (Loan[] memory)
    {
        uint256 len = loans.length;
        Loan[] memory ret = new Loan[](len);
        uint256 k = 0;
        for (uint256 i = 0; i < len; i++) {
            if (companyAddress == loans[i].request_company) {
                ret[k++] = loans[i];
            }
        }
        return ret;
    }

    // 计算转账后增加的信用等级
    function calculateCredit(
        address borrow_company, // 发起采购/借款的公司
        uint256 money, // 金额
        bool is_from_upstream // 是否来自于核心企业
    ) public view returns (uint256 growth) {
        if (!is_from_upstream) {
            return 0;
        }
        Company memory bc = getCompanyByAddress(borrow_company);
        uint256 prev_credit = bc.credit;
        return prev_credit / 10 + money / 50;
    }

    // 调整某个账单的金额
    function adjustMoneyForBill(
        uint256 bid, // 待调整的账单的id
        uint256 money // 调整后的金额
    ) public view returns (bool value) {
        for (uint256 i = 0; i < bills.length; i++) {
            if (bills[i].bill_id == bid) {
                if (money > bills[i].money) {
                    return false;
                } else {
                    bills[i].money = money;
                    return true;
                }
            }
        }
        return true;
    }

    // 增加bill
    function addBill(
        address borrow_company,
        address lend_company,
        uint256 money,
        uint256 start_date,
        uint256 end_date,
        bool is_pass,
        bool is_finish,
        bool is_from_upstream,
        uint256 credit_growth
    ) public returns (bool success) {
        bills.push(
            Bill(
                bill_id,
                borrow_company,
                lend_company,
                money,
                start_date,
                end_date,
                is_pass,
                is_finish,
                is_from_upstream,
                credit_growth
            )
        );
        bill_id++;
        return true;
    }

    // 增加一条loan
    function addLoan(
        address request_company,
        address bank_address,
        uint256 start_date,
        uint256 end_date,
        bool is_pass,
        bool is_finish,
        uint256 money
    ) public returns (bool success) {
        loans.push(
            Loan(
                loan_id,
                request_company,
                bank_address,
                start_date,
                end_date,
                is_pass,
                is_finish,
                money
            )
        );
        loan_id++;
        return true;
    }

    // 增加一笔交易
    function addDeal(
        address buyer_company,
        address seller_company,
        uint256 start_date,
        bool is_finish,
        string merchant,
        uint256 money
    ) public returns (bool success) {
        deals.push(
            Deal(
                deal_id,
                buyer_company,
                seller_company,
                start_date,
                is_finish,
                merchant,
                money
            )
        );
        deal_id++;
        return true;
    }

    // 转让一部分应收账单
    function splitBillToAnotherCompany(
        address from, // 从哪家公司转让
        address to, // 转让到哪家公司
        uint256 bid, // 被拆分的账单
        uint256 money, // 转让金额
        uint256 timestamp // 当前时间
    ) public returns (Message memory) {
        Bill memory bill_to_be_split;
        bool flag = false;
        for (uint256 i = 0; i < bills.length; i++) {
            if (bid == bills[i].bill_id) {
                flag = true;
                bill_to_be_split = bills[i];
                break;
            }
        }
        if (!flag) {
            return Message(false, "该账单不存在");
        }

        if (bill_to_be_split.lend_company != from) {
            return Message(false, "该账单并不属于该公司");
        }

        if (bill_to_be_split.borrow_company == to) {
            return Message(false, "该账单不可被转让，因为接收者需要还款");
        }

        if (money > bill_to_be_split.money) {
            return Message(false, "转让金额大于了账单原有金额");
        }

        if (timestamp > bill_to_be_split.end_date) {
            return Message(false, "该账单已经过期");
        }

        if (!bill_to_be_split.is_pass) {
            return Message(false, "该账单还没有通过审核");
        }

        if (bill_to_be_split.is_finish) {
            return Message(false, "该账单已完成还款，不可再被拆分");
        }
        // 鉴权完成，开始转让
        // 调整原有的账单金额
        adjustMoneyForBill(bid, bill_to_be_split.money - money);
        // 新增一份订单
        addBill(
            bill_to_be_split.borrow_company,
            to,
            money,
            timestamp,
            bill_to_be_split.end_date,
            false,
            false,
            bill_to_be_split.is_from_upstream,
            0
        );

        return Message(true, "转让完成, 等待审核中");
    }

    // 通过某一笔账单的审核
    function passBill(uint256 bid) public returns (Message memory) {
        for (uint256 i = 0; i < bills.length; i++) {
            if (bid == bills[i].bill_id) {
                if (bills[i].is_pass) {
                    return Message(true, "该账单已经通过审核");
                } else {
                    bills[i].is_pass = true;
                    addCreditLevel(
                        bills[i].lend_company,
                        bills[i].credit_growth
                    );
                    return Message(true, "该账单成功通过审核");
                }
            }
        }
        return Message(false, "该账单不存在");
    }

    // 提交一笔应收款账单
    function submitBill(
        address borrow_company, // 请求借钱/采购的公司
        address lend_company, // 同意采购/批准借款的公司
        uint256 money, // 金额
        uint256 start_date, // 发起时间
        uint256 end_date, // 应还款时间
        bool is_from_upstream
    ) public returns (Message memory) {
        if (start_date > end_date) {
            return Message(false, "时间不合法");
        }
        uint256 credit_change = calculateCredit(
            borrow_company,
            money,
            is_from_upstream
        );
        addBill(
            borrow_company,
            lend_company,
            money,
            start_date,
            end_date,
            false,
            false,
            is_from_upstream,
            credit_change
        );
    }

    // 判断是否银行是否能为该公司提供贷款
    function canLoanToThisCompany(
        address company,
        address bank_address,
        uint256 current_credit,
        uint256 money
    ) public returns (bool can) {
        Company memory c = getCompanyByAddress(company);

        // 若贷款公司的资产大于其要借的钱数，则直接同意
        if (c.asset >= money) {
            return true;
        }

        // 若贷款公司的资产与其信用值乘50大于要借的钱数，也直接同意
        if (c.asset + current_credit * 50 >= money) {
            return true;
        }
        return false;
    }

    // 提交一笔银行融资
    function submitLoan(
        address request_company,
        address bank_address,
        uint256 start_date,
        uint256 end_date,
        uint256 money,
        uint256 current_credit
    ) public returns (Message memory) {
        if (start_date >= end_date) {
            return Message(false, "日期不合法");
        }
        if (
            canLoanToThisCompany(
                request_company,
                bank_address,
                current_credit,
                money
            )
        ) {
            addLoan(
                request_company,
                bank_address,
                start_date,
                end_date,
                false,
                false,
                money
            );
            return Message(true, "提交贷款申请成功");
        } else {
            return Message(false, "提交贷款申请失败");
        }
    }

    // 通过贷款审核
    function passLoan(uint256 lid) public returns (Message memory) {
        for (uint256 i = 0; i < loans.length; i++) {
            if (lid == loans[i].loan_id) {
                if (loans[i].is_pass) {
                    return Message(true, "该贷款已经通过审核");
                } else {
                    loans[i].is_pass = true;
                    addAsset(loans[i].request_company, loans[i].money);
                    return Message(true, "该贷款成功通过审核");
                }
            }
        }
        return Message(false, "该贷款不存在");
    }

    // 判断买家是否可以通过账单来交易
    function canBuyerDealByBill(address buyer_company, uint256 money)
        public
        view
        returns (bool can)
    {
        Bill[] memory buyer_bills = getLendBillsByCompanyAddress(buyer_company);
        for (uint256 i = 0; i < buyer_bills.length; i++) {
            if (
                buyer_bills[i].is_from_upstream && buyer_bills[i].money > money
            ) {
                return true;
            }
        }
        return false;
    }

    // 判断买家是否能够提交交易
    function canBuyerSubmitDeal(address buyer_company, uint256 money)
        public
        view
        returns (bool can)
    {
        // 如果买家是核心企业，则可以交易
        if (is_upstream[buyer_company]) {
            return true;
        }

        // 如果买家的资金充足，也可以交易
        if (assets[buyer_company] >= money) {
            return true;
        }

        // 如果买家持有面值较大的账单，也可以交易
        if (canBuyerDealByBill(buyer_company, money)) {
            return true;
        }

        return false;
    }

    // 提交一笔交易
    function submitDeal(
        address buyer_company,
        address seller_company,
        uint256 start_date,
        string merchant,
        uint256 money
    ) public returns (Message memory) {
        if (buyer_company == seller_company) {
            return Message(false, "买家和卖家不能同为一家公司");
        }

        addDeal(
            buyer_company,
            seller_company,
            start_date,
            false,
            merchant,
            money
        );
        return Message(true, "提出交易申请成功");
    }

    // 通过一笔交易
    function passDeal(uint256 did) public returns (Message memory) {
        for (uint256 i = 0; i < deals.length; i++) {
            if (did == deals[i].deal_id) {
                if (deals[i].is_finish) {
                    return Message(true, "该交易已经被通过");
                } else {
                    deals[i].is_finish = true;
                    addAsset(deals[i].seller_company, deals[i].money);
                    decreaseAsset(deals[i].buyer_company, deals[i].money);
                    return Message(true, "该交易通过成功");
                }
            }
        }
        return Message(false, "交易不存在");
    }

    /** --------------- **/
}
