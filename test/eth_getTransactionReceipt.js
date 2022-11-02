const supertest = require('supertest')
const expect = require('chai').expect
const request = supertest(process.env.ETH_JSON_RPC_URL)

const payload = {
  jsonrpc: "2.0",
  method: "eth_getTransactionReceipt",
  params: [],
  id: 1
}

describe('happy path', function () {
  it('returns the receipt of the transaction by transaction hash', async function () {
    payload.params = [
      global.TRANSACTION_HASH
    ]
    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc, "2.0")
    expect(response.body.id, 1)
    expect(response.body.result).to.contain.all.keys(
      'blockHash',
      'blockNumber',
      'contractAddress',
      'cumulativeGasUsed',
      'effectiveGasPrice',
      'from',
      'gasUsed',
      'logs',
      'logsBloom',
      'status',
      'to',
      'transactionHash',
      'transactionIndex',
      'type')
  })
})

describe('no/pending receipt', function () {
  it('should return result null', async function () {
    payload.params = [
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
    ]
    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc, "2.0")
    expect(response.body.id, 1)
    expect(response.body.result).to.be.null
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
  it('returns error -32602 invalid argument 0: hex string has length 0, want 64 for common.Hash', async function () {
    payload.params = ['']
    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc).to.equal('2.0')
    expect(response.body.id).to.equal(1)
    expect(response.body.error.code).to.equal(-32602)
    expect(response.body.error.message).to.equal('invalid argument 0: hex string has length 0, want 64 for common.Hash')
  })
})

describe('incorrect param 0', function () {
  it('returns error -32602 invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go value of type common.Hash', async function () {
    payload.params = ['1234']
    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc).to.equal('2.0')
    expect(response.body.id).to.equal(1)
    expect(response.body.error.code).to.equal(-32602)
    expect(response.body.error.message).to.equal('invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go value of type common.Hash')
  })
})