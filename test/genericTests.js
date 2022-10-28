const supertest = require('supertest')
const expect = require('chai').expect
const request = supertest(process.env.ETH_JSON_RPC_URL)
const ethers = require('ethers')

describe('no method value provided', function () {
  it('returns error -32600 invalid request', async function () {
    const payload = {
      jsonrpc: '2.0',
      method: '',
      params: [],
      id: 1
    }
    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc).to.equal('2.0')
    expect(response.body.id).to.equal(1)
    expect(response.body.error.code).to.equal(-32600)
    expect(response.body.error.message).to.equal('invalid request')
  })
})

describe('no method key provided', function () {
  it('returns error -32600 invalid request', async function () {
    const payload = {
      jsonrpc: '2.0',
      params: [],
      id: 1
    }
    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc).to.equal('2.0')
    expect(response.body.id).to.equal(1)
    expect(response.body.error.code).to.equal(-32600)
    expect(response.body.error.message).to.equal('invalid request')
  })
})

describe('no id provided', function () {
  it('returns the method response normally', async function () {
    const payload = {
      jsonrpc: '2.0',
      method: 'eth_chainId',
      params: [],
    }
    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc).to.equal('2.0')
    expect(response.body.id).to.equal(null)
    expect(ethers.utils.isHexString(response.body.result)).is.true
    expect(parseInt(response.body.result, 16)).to.be.a('number')
  })
})

describe('no jsonrpc provided', function () {
  it('returns the method response normally', async function () {
    const payload = {
      method: 'eth_chainId',
      params: [],
      id: 1
    }
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

describe('no jsonrpc or id provided', function () {
  it('returns the method response normally', async function () {
    const payload = {
      method: 'eth_chainId',
      params: [],
    }
    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc).to.equal('2.0')
    expect(response.body.id).to.equal(null)
    expect(ethers.utils.isHexString(response.body.result)).is.true
    expect(parseInt(response.body.result, 16)).to.be.a('number')
  })
})

describe('no jsonrpc, id or params provided', function () {
  it('returns the method response normally', async function () {
    const payload = {
      method: 'eth_chainId',
    }
    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc).to.equal('2.0')
    expect(response.body.id).to.equal(null)
    expect(ethers.utils.isHexString(response.body.result)).is.true
    expect(parseInt(response.body.result, 16)).to.be.a('number')
  })
})

describe('empty json payload provided', function () {
  it('returns error -32600 invalid request', async function () {
    const payload = {}
    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc).to.equal('2.0')
    expect(response.body.id).to.equal(null)
    expect(response.body.error.code).to.equal(-32600)
    expect(response.body.error.message).to.equal('invalid request')
  })
})

describe('no body provided', function () {
  it('returns and empty body', async function () {
    const response = await request
      .post('/')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body).to.equal('')
  })
})

describe('invalid json payload provided', function () {
  it('returns error -32601 failed to parse request', async function () {
    const payload = `{234234}`
    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(400);
    expect(response.body.jsonrpc).to.equal('2.0')
    expect(response.body.id).to.equal(null)
    expect(response.body.error.code).to.equal(-32601)
    expect(response.body.error.message).to.equal('failed to parse request')
  })
})