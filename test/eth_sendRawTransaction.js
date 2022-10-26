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


describe('happy path', function () {
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
    expect(response.body.jsonrpc, "2.0");
    expect(response.body.id, 1);
    expect(ethers.utils.isHexString(response.body.result), true)
    global.TRANSACTION_HASH = response.body.result

  })
})

describe('empty string paramater provided', function () {
  it('should return error, transaction could not be decoded message', async function () {
    payload.params = [
      ''
    ]
    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc, '2.0')
    expect(response.body.id, 1)
    expect(response.body.error.code, -32602)
    expect(response.body.error.message, 'transaction could not be decoded: input must start with 0x')
  })
})

describe('no paramater provided', function () {
  it('should return error, transaction could not be decoded message', async function () {
    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc, '2.0')
    expect(response.body.id, 1)
    expect(response.body.error.code, -32602)
    expect(response.body.error.message, 'transaction could not be decoded: input must start with 0x')
  })
})

describe('insufficient funds', function () {
  it('should return error, insufficient funds', async function () {

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_NO_BALANCE, helpers.provider)
    const txCount = await wallet.getTransactionCount()
    const rawTxn = await helpers.getRawTxn(txCount, 21000, 20000000000, "0x640a6D5A3f155A8F0636a0396B18Ba5eEdfab440", "1", null, wallet)

    payload.params = [
      rawTxn
    ]

    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc, '2.0')
    expect(response.body.id, 1)
    expect(response.body.error.code, -32000)
    expect(response.body.error.message, 'insufficient funds for gas * price + value')
  })
})
