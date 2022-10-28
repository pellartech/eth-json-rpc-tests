const supertest = require('supertest')
const expect = require('chai').expect
const request = supertest(process.env.ETH_JSON_RPC_URL)

const payload = {
  jsonrpc: '2.0',
  method: 'eth_syncing',
  params: [],
  id: 1
}

describe('happy path', function () {
  it('returns an object with data about the sync status or false', async function () {
    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc).to.equal('2.0')
    expect(response.body.id).to.equal(1)
    expect(response.body.result).to.be.oneOf([true, false]) // TODO: add syncing details here instead of true
  })
})

describe('send a single test param', function () {
  it('returns error -32602 too many arguments, want at most 0', async function () {
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
    expect(response.body.error.code).to.equal(-32602)
    expect(response.body.error.message).to.equal('too many arguments, want at most 0')
  })
})