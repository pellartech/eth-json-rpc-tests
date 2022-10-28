const supertest = require('supertest')
const expect = require('chai').expect
const request = supertest(process.env.ETH_JSON_RPC_URL)
const ethers = require('ethers')

const payload = {
  jsonrpc: '2.0',
  method: 'eth_chainId',
  params: [],
  id: 1
}

describe('happy path', function () {
  it('returns the chain id of the current network as hex', async function () {
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

describe('send single test param', function () {
  it('returns the chain id of the current network as hex', async function () {
    payload.params = [
      'testParam'
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