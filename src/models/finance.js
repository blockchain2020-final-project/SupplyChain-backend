class Finance {
  constructor(id, oriReceiptId, debtorAddr, debteeAddr, paidAmount, oriAmount, interestAmount, createTime, deadline, lastPaidTime, annualInterestRate, status) {
    this.id = id
    this.oriReceiptId = oriReceiptId
    this.debtorAddr = debtorAddr
    this.debteeAddr = debteeAddr
    this.paidAmount = paidAmount
    this.oriAmount = oriAmount
    this.interestAmount = interestAmount
    this.createTime = createTime
    this.deadline = deadline
    this.lastPaidTime = lastPaidTime
    this.annualInterestRate = annualInterestRate
    this.status = status
  }
}