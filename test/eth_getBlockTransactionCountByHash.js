const supertest = require('supertest')
const expect = require('chai').expect
const request = supertest(process.env.ETH_JSON_RPC_URL)
const ethers = require("ethers")

const payload = {
  jsonrpc: "2.0",
  method: "eth_getBlockTransactionCountByHash",
  params: [],
  id: 1
}

describe('happy path', function () {
  it('returns the number of transactions (as hex) in a block from a block matching the given block hash', async function () {
    payload.params = [
      process.env.KNOWN_BLOCK_HASH
    ]
    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc).to.equal('2.0')
    expect(response.body.id).to.equal(1)
    expect(ethers.utils.isHexString(response.body.result)).is.true
    expect(parseInt(response.body.result, 16)).to.be.a('number')
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
    payload.params = [
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
    expect(response.body.error.message).to.equal('invalid argument 0: hex string has length 0, want 64 for common.Hash')
  })
})

describe('incorrect param 0', function () {
  it('returns error -32602 invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go value of type common.Hash', async function () {
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
    expect(response.body.error.message).to.equal('invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go value of type common.Hash')
  })
})

describe('incorrect json', function () {
  it('returns error -32602 invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go value of type common.Hash', async function () {
    payload.params = [
      '1234',,
    ]
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

describe('unkown block hash', function () {
  it('returns null', async function () {
    payload.params = [
      '0xad1328d13f833b8af722117afdc406a762033321df8e48c00cd372d462ffffff'
    ]
    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc).to.equal('2.0')
    expect(response.body.id).to.equal(1)
    expect(response.body.result).to.be.null
  })
})

