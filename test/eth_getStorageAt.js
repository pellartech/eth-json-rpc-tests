const supertest = require('supertest')
const expect = require('chai').expect
const request = supertest(process.env.ETH_JSON_RPC_URL)
const ethers = require('ethers')

const payload = {
  jsonrpc: '2.0',
  method: 'eth_getStorageAt',
  params: [],
  id: 1
}

describe('happy path', function () {
  it('returns the value from a storage position as hex', async function () {
    payload.params = [
      '0xffffffffffffffffffffffffffffffffffffffff',
      '0x0',
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
  })
})

describe('block param hex number', function () {
  it('returns the value from a storage position as hex', async function () {
    payload.params = [
      '0xffffffffffffffffffffffffffffffffffffffff',
      '0x0',
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
  })
})

describe('block param earliest', function () {
  it('returns the value from a storage position as hex', async function () {
    payload.params = [
      '0xffffffffffffffffffffffffffffffffffffffff',
      '0x0',
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
  })
})

describe('block param finalized', function () {
  it('returns the value from a storage position as hex', async function () {
    payload.params = [
      '0xffffffffffffffffffffffffffffffffffffffff',
      '0x0',
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
  })
})

describe('block param safe', function () {
  it('returns the value from a storage position as hex', async function () {
    payload.params = [
      '0xffffffffffffffffffffffffffffffffffffffff',
      '0x0',
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
  })
})

describe('block param pending', function () {
  it('returns the value from a storage position as hex', async function () {
    payload.params = [
      '0xffffffffffffffffffffffffffffffffffffffff',
      '0x0',
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
  })
})

describe('no params', function () {
  it('returns error missing value for required argument 0', async function () {
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
    payload.params = [
      '',
      '0x0',
      'latest'
    ]
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
  it('returns error missing value for required argument 1', async function () {
    payload.params = [
      '0xffffffffffffffffffffffffffffffffffffffff',
      '',
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
  })
})

describe('empty param 2', function () {
  it('returns error -32602 invalid argument 2: empty hex string', async function () {
    payload.params = [
      '0xffffffffffffffffffffffffffffffffffffffff',
      '0x1',
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
    expect(response.body.error.message).to.equal('invalid argument 2: empty hex string')
  })
})

describe('incorrect param 0', function () {
  it('returns error -32602 invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go value of type common.Address', async function () {
    payload.params = [
      '1234',
      '0x0',
      'latest'
    ]
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

describe('incorrect param 1', function () {
  it('returns error -32602 missing value for required argument 0', async function () {
    payload.params = [
      '0xffffffffffffffffffffffffffffffffffffffff',
      '1234',
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
  })
})

describe('incorrect param 2', function () {
  it('returns error -32602 invalid argument 2: hex string without 0x prefix', async function () {
    payload.params = [
      '0xffffffffffffffffffffffffffffffffffffffff',
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
    expect(response.body.error.message).to.equal('invalid argument 2: hex string without 0x prefix')
  })
})
