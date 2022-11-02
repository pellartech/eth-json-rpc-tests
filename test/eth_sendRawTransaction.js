const supertest = require('supertest')
const request = supertest(process.env.ETH_JSON_RPC_URL)
const helpers = require("./helpers")
const ethers = require("ethers")
const expect = require('chai').expect

const payload = {
  jsonrpc: "2.0",
  method: "eth_sendRawTransaction",
  params: [],
  id: 1
}

const contract = '0x608060405234801561001057600080fd5b5061020f806100206000396000f3fe608060405234801561001057600080fd5b506004361061005e576000357c0100000000000000000000000000000000000000000000000000000000900480632e64cec1146100635780636057361d14610081578063ffae399e146100af575b600080fd5b61006b6100df565b6040518082815260200191505060405180910390f35b6100ad6004803603602081101561009757600080fd5b81019080803590602001909291905050506100e8565b005b6100dd600480360360208110156100c557600080fd5b8101908080351515906020019092919050505061016a565b005b60008054905090565b600581141515610160576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600d8152602001807f4e756d206d75737420626520350000000000000000000000000000000000000081525060200191505060405180910390fd5b8060008190555050565b801515156101e0576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600e8152602001807f687572726179207265766572742100000000000000000000000000000000000081525060200191505060405180910390fd5b5056fea165627a7a723058207c8765023d1bc4d97e511290257772570fc5bcd6f76cd593d7e2a0d772d184910029'

// Legacy Transasction

describe('happy path legacy tx', function () {
  it('returns the hash of the transaction', async function () {

    const txCount = await helpers.wallet.getTransactionCount()
    const gasPrice = await helpers.provider.getGasPrice()
    const rawTxn = await helpers.getRawTxn(txCount, 21000, gasPrice, "0xc5d0A5583615782d3041aFA6C9a7Af034c695914", "0.001", null)

    payload.params = [
      rawTxn
    ]

    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc).to.equal('2.0')
    expect(response.body.id).to.equal(1)
    expect(ethers.utils.isHexString(response.body.result)).is.true

    // set tranaction hash to be used in later tests (getTransactionReceipt)
    global.TRANSACTION_HASH = response.body.result

    // wait to tx to be mined
    const receipt = await helpers.provider.waitForTransaction(global.TRANSACTION_HASH, 1)
    expect(receipt.status).to.equal(1)

    global.TRANSACTION_BLOCK_NO = ethers.utils.hexlify(receipt.blockNumber)
    global.TRANSACTION_INDEX = ethers.utils.hexlify(receipt.transactionIndex)
    global.TRANSACTION_BLOCK_HASH = receipt.blockHash

    expect(parseInt(receipt.blockNumber, 16)).to.be.a('number')
  })
})

describe('no params', function () {
  it('returns error -32602 missing value for required argument 0', async function () {
    payload.params = []
    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc).to.equal('2.0')
    expect(response.body.id).to.equal(1)
    expect(response.body.error.code).to.equal(-32602)
    expect(response.body.error.message).to.equal('missing value for required argument 0')
  })
})

describe('empty param 0', function () {
  it('returns error -32000 typed transaction too short', async function () {
    payload.params = ['']
    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc).to.equal('2.0')
    expect(response.body.id).to.equal(1)
    expect(response.body.error.code).to.equal(-32000)
    expect(response.body.error.message).to.equal('typed transaction too short')
  })
})

describe('incorrect param 0', function () {
  it('returns error -32602 invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go value of type hexutil.Bytes', async function () {
    payload.params = [
      '1234'
    ]
    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc).to.equal('2.0')
    expect(response.body.id).to.equal(1)
    expect(response.body.error.code).to.equal(-32602)
    expect(response.body.error.message).to.equal('invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go value of type hexutil.Bytes')
  })
})

describe('insufficient funds tx value', function () {
  it('returns error -32000 insufficient funds for gas * price + value', async function () {

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_NO_BALANCE, helpers.provider)
    const txCount = await wallet.getTransactionCount()
    const gasPrice = await helpers.provider.getGasPrice()
    const rawTxn = await helpers.getRawTxn(txCount, 21000, gasPrice, "0x640a6D5A3f155A8F0636a0396B18Ba5eEdfab440", "100000000", null, wallet)

    payload.params = [
      rawTxn
    ]

    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc).to.equal('2.0')
    expect(response.body.id).to.equal(1)
    expect(response.body.error.code).to.equal(-32000)
    expect(response.body.error.message).to.equal('insufficient funds for gas * price + value')
  })
})

describe('insufficient funds gas price', function () {
  it('returns error -32000 insufficient funds for gas * price + value', async function () {

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_NO_BALANCE, helpers.provider)
    const txCount = await wallet.getTransactionCount()
    const rawTxn = await helpers.getRawTxn(txCount, 21000, 10000000000000, "0x640a6D5A3f155A8F0636a0396B18Ba5eEdfab440", "0.001", null, wallet)

    payload.params = [
      rawTxn
    ]

    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc).to.equal('2.0')
    expect(response.body.id).to.equal(1)
    expect(response.body.error.code).to.equal(-32000)
    expect(response.body.error.message).to.equal('insufficient funds for gas * price + value')
  })
})

describe('nonce too low', function () {
  it('returns error -32000 nonce too low', async function () {

    const gasPrice = await helpers.provider.getGasPrice()
    const txCount = await helpers.wallet.getTransactionCount()
    const rawTxn = await helpers.getRawTxn(txCount - 1, 21000, gasPrice, "0x640a6D5A3f155A8F0636a0396B18Ba5eEdfab440", "0.001", null)

    payload.params = [
      rawTxn
    ]

    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc).to.equal('2.0')
    expect(response.body.id).to.equal(1)
    expect(response.body.error.code).to.equal(-32000)
    expect(response.body.error.message).to.equal('nonce too low')
  })
})

// Smart Contract Transactions

describe('happy path deploy contract', function () {
  it('returns the hash of the transaction, tx receipt status 1', async function () {

    const txCount = await helpers.wallet.getTransactionCount()
    const gasPrice = await helpers.provider.getGasPrice()
    const rawTxn = await helpers.getRawTxn(txCount, 200000, gasPrice * 2, null, "0", contract)

    payload.params = [
      rawTxn
    ]

    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc).to.equal('2.0')
    expect(response.body.id).to.equal(1)
    expect(ethers.utils.isHexString(response.body.result)).is.true

    // set tranaction hash to be used in later tests (getTransactionReceipt)
    global.CONTRACT_TRANSACTION_HASH = response.body.result

    // wait to tx to be mined
    const receipt = await helpers.provider.waitForTransaction(global.CONTRACT_TRANSACTION_HASH, 1)
    global.CONTRACT_ADDRESS = receipt.contractAddress
    expect(receipt.status).to.equal(1)
  })
})


describe('intrinic gas too low', function () {
  it('returns error -32000 intrinsic gas too low', async function () {

    const txCount = await helpers.wallet.getTransactionCount()
    const gasPrice = await helpers.provider.getGasPrice()
    const rawTxn = await helpers.getRawTxn(txCount, 23000, gasPrice, null, "0", contract)

    payload.params = [
      rawTxn
    ]

    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc).to.equal('2.0')
    expect(response.body.id).to.equal(1)
    expect(response.body.error.code).to.equal(-32000)
    expect(response.body.error.message).to.equal('intrinsic gas too low')
  })
})

describe('test contract revert', function () {
  it('returns the hash of the transaction, tx receipt status 0', async function () {

    const input = '0xffae399e0000000000000000000000000000000000000000000000000000000000000001'
    const txCount = await helpers.wallet.getTransactionCount()
    const gasPrice = await helpers.provider.getGasPrice()
    const rawTxn = await helpers.getRawTxn(txCount, 200000, gasPrice * 2, global.CONTRACT_ADDRESS, "0", input)

    payload.params = [
      rawTxn
    ]

    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc).to.equal('2.0')
    expect(response.body.id).to.equal(1)
    expect(ethers.utils.isHexString(response.body.result)).is.true

    // wait to tx to be mined
    const receipt = await helpers.provider.waitForTransaction(response.body.result, 1)
    expect(receipt.status).to.equal(0)
  })
})

describe('test contract write', function () {
  it('returns the hash of the transaction. Stores value 5 in contract storage, tx receipt status 1', async function () {

    const input = '0x6057361d0000000000000000000000000000000000000000000000000000000000000005'
    const txCount = await helpers.wallet.getTransactionCount()
    const gasPrice = await helpers.provider.getGasPrice()
    const rawTxn = await helpers.getRawTxn(txCount, 200000, gasPrice * 2, global.CONTRACT_ADDRESS, "0", input)

    payload.params = [
      rawTxn
    ]

    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc).to.equal('2.0')
    expect(response.body.id).to.equal(1)
    expect(ethers.utils.isHexString(response.body.result)).is.true

    // wait to tx to be mined
    const receipt = await helpers.provider.waitForTransaction(response.body.result, 1)
    expect(receipt.status).to.equal(1)
  })
})
