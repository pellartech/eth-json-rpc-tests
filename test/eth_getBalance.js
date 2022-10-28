const supertest = require('supertest')
const expect = require('chai').expect
const request = supertest(process.env.ETH_JSON_RPC_URL)
const ethers = require('ethers')

const payload = {
  jsonrpc: '2.0',
  method: 'eth_getBalance',
  params: [],
  id: 1
}

describe('happy path', function () {
  it('returns the balance of the account of the given address as hex', async function () {
    payload.params = [
      '0x0000000000000000000000000000000000000000',
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
    expect(parseInt(response.body.result, 16)).to.be.a('number')
  })
})

describe('block param hex number', function () {
  it('returns the balance of the account of the given address as hex', async function () {
    payload.params = [
      '0x0000000000000000000000000000000000000000',
      '0x1'
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

describe('block param earliest', function () {
  it('returns the balance of the account of the given address as hex', async function () {
    payload.params = [
      '0x0000000000000000000000000000000000000000',
      'earliest'
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

describe('block param finalized', function () {
  it('returns the balance of the account of the given address as hex', async function () {
    payload.params = [
      '0x0000000000000000000000000000000000000000',
      'finalized'
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

describe('block param safe', function () {
  it('returns the balance of the account of the given address as hex', async function () {
    payload.params = [
      '0x0000000000000000000000000000000000000000',
      'safe'
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

describe('block param pending', function () {
  it('returns the balance of the account of the given address as hex', async function () {
    payload.params = [
      '0x0000000000000000000000000000000000000000',
      'pending'
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
  it('returns error -32602 invalid argument 0: hex string has length 0, want 40 for common.Address', async function () {
    payload.params = ['']
    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc).to.equal('2.0')
    expect(response.body.id).to.equal(1)
    expect(response.body.error.code).to.equal(-32602)
    expect(response.body.error.message).to.equal('invalid argument 0: hex string has length 0, want 40 for common.Address')
  })
})

describe('empty param 1', function () {
  it('returns error -32602 invalid argument 1: empty hex string', async function () {
    payload.params = [
      '0x0000000000000000000000000000000000000000',
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
  it('returns error -32602 invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go value of type common.Address', async function () {
    payload.params = ['1234']
    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc).to.equal('2.0')
    expect(response.body.id).to.equal(1)
    expect(response.body.error.code).to.equal(-32602)
    expect(response.body.error.message).to.equal('invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go value of type common.Address')
  })
})

describe('incorrect param 2', function () {
  it('returns error -32602 invalid argument 1: hex string without 0x prefix', async function () {
    payload.params = [
      '0x0000000000000000000000000000000000000000',
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