const supertest = require('supertest')
const expect = require('chai').expect
const request = supertest(process.env.ETH_JSON_RPC_URL)
const ethers = require("ethers")

const payload = {
  jsonrpc: "2.0",
  method: "eth_getBlockByNumber",
  params: [],
  id: 1
}


describe('happy path', function () {
  it('returns information about a block by number', async function () {
    payload.params = [
      "0x1",
      false
    ]
    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc).to.equal('2.0')
    expect(response.body.id).to.equal(1)
    expect(response.body.result).to.contain.all.keys(
      'difficulty',
      'extraData',
      'gasLimit',
      'gasUsed',
      'hash',
      'logsBloom',
      'miner',
      'mixHash',
      'nonce',
      'number',
      'parentHash',
      'receiptsRoot',
      'sha3Uncles',
      'size',
      'stateRoot',
      'timestamp',
      'totalDifficulty',
      'transactions',
      'transactionsRoot',
      'uncles');
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
  it('returns error -32602 invalid argument 0: empty hex string', async function () {
    payload.params = ['']
    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc).to.equal('2.0')
    expect(response.body.id).to.equal(1)
    expect(response.body.error.code).to.equal(-32602)
    expect(response.body.error.message).to.equal('invalid argument 0: empty hex string')
  })
})

describe('empty param 1', function () {
  it('returns error -32602 invalid argument 1: json: cannot unmarshal string into Go value of type bool', async function () {
    payload.params = [
      '0x0',
      ''
    ]
    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc).to.equal('2.0')
    expect(response.body.id).to.equal(1)
    expect(response.body.error.code).to.equal(-32602)
    expect(response.body.error.message).to.equal('invalid argument 1: json: cannot unmarshal string into Go value of type bool')
  })
})

describe('incorrect param 0', function () {
  it('returns error -32602 invalid argument 0: hex string without 0x prefix', async function () {
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
    expect(response.body.error.message).to.equal('invalid argument 0: hex string without 0x prefix')
  })
})

describe('incorrect param 1', function () {
  it('returns error -32602 invalid argument 1: json: cannot unmarshal string into Go value of type bool', async function () {
    payload.params = [
      '0x0',
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
    expect(response.body.error.message).to.equal('invalid argument 1: json: cannot unmarshal string into Go value of type bool')
  })
})