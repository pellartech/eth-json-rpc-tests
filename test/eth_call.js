const supertest = require('supertest')
const expect = require('chai').expect
const request = supertest(process.env.ETH_JSON_RPC_URL)
const ethers = require("ethers")

const payload = {
  jsonrpc: "2.0",
  method: "eth_call",
  params: [],
  id: 1
}

describe('happy path', function () {
  it('returns value stored in the contract', async function () {
    payload.params = [
      {
        to: global.CONTRACT_ADDRESS,
        data: '0x2e64cec1'
      },
      'latest'
    ]
    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc).to.equal('2.0')
    expect(response.body.id).to.equal(1)
    expect(ethers.utils.isHexString(response.body.result)).is.true
    expect(response.body.result).to.equal('0x0000000000000000000000000000000000000000000000000000000000000005')
  })
})

describe('trigger revert', function () {
  it('returns error 3 execution reverted: hurray revert!', async function () {
    payload.params = [
      {
        to: global.CONTRACT_ADDRESS,
        data: '0xffae399e0000000000000000000000000000000000000000000000000000000000000001'
      },
      'latest'
    ]
    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc).to.equal('2.0')
    expect(response.body.id).to.equal(1)
    expect(response.body.error.code).to.equal(3)
    expect(response.body.error.message).to.equal('execution reverted: hurray revert!')
    expect(response.body.error.data).to.equal('0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000e6875727261792072657665727421000000000000000000000000000000000000')
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
  it('returns error -32602 invalid argument 0: json: cannot unmarshal string into Go value of type ethapi.TransactionArgs', async function () {
    payload.params = ['']
    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc).to.equal('2.0')
    expect(response.body.id).to.equal(1)
    expect(response.body.error.code).to.equal(-32602)
    expect(response.body.error.message).to.equal('invalid argument 0: json: cannot unmarshal string into Go value of type ethapi.TransactionArgs')
  })
})

describe('empty param 1', function () {
  it('returns error -32602 invalid argument 1: empty hex string', async function () {
    payload.params = [
      {
        to: global.CONTRACT_ADDRESS,
        data: '0x2e64cec1'
      },
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
    expect(response.body.error.message).to.equal('invalid argument 1: empty hex string')
  })
})

describe('incorrect param 0', function () {
  it('returns error -32602 invalid argument 0: json: cannot unmarshal string into Go value of type ethapi.TransactionArgs', async function () {
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
    expect(response.body.error.message).to.equal('invalid argument 0: json: cannot unmarshal string into Go value of type ethapi.TransactionArgs')
  })
})

describe('incorrect param 1', function () {
  it('returns error -32602 invalid argument 1: hex string without 0x prefix', async function () {
    payload.params = [
      {
        to: global.CONTRACT_ADDRESS,
        data: '0x2e64cec1'
      },
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
    expect(response.body.error.message).to.equal('invalid argument 1: hex string without 0x prefix')
  })
})