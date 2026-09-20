require('dotenv').config();

module.exports = {
  bankDetails: {
    bankName: process.env.BANK_NAME || 'Bank of Ceylon',
    accountName: process.env.BANK_ACCOUNT_NAME || 'PearlPath Pvt Ltd',
    accountNumber: process.env.BANK_ACCOUNT_NUMBER || '123456789',
    branch: process.env.BANK_BRANCH || 'Colombo',
    branchCode: process.env.BANK_BRANCH_CODE || '001',
    swiftCode: process.env.BANK_SWIFT_CODE || 'BCEY123'
  }
};
