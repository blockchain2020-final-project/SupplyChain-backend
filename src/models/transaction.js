const { default: create } = require("keccak")

class Transaction {
  constructor(id, sellerAddr, buyerAddr, amount, createTime, deadline, tMode, oriReceiptId, requestStatus) {
    this.id = id
    this.sellerAddr = sellerAddr
    this.buyerAddr = buyerAddr
    this.amount = amount
    this.createTime = createTime
    this.deadline = deadline
    this.tMode = tMode
    this.oriReceiptId = oriReceiptId
    this.requestStatus = requestStatus
  }
}