class Receipt {
  constructor(id, debtorAddr, debteeAddr, curAmount, oriAmount, createTime, deadline, bankSignature, coreCompanySignature) {
    this.id = id
    this.debtorAddr = debtorAddr
    this.debteeAddr = debteeAddr
    this.curAmount = curAmount
    this.oriAmount = oriAmount
    this.createTime = createTime
    this.deadline = deadline
    this.bankSignature = bankSignature
    this.coreCompanySignature = coreCompanySignature
  }
}