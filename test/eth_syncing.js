const supertest = require('supertest')
const expect = require('chai').expect
const request = supertest(process.env.ETH_JSON_RPC_URL)
const ethers = require("ethers")

const payload = {
  jsonrpc: "2.0",
  method: "eth_syncing",
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
    expect(response.body.jsonrpc, "2.0");
    expect(response.body.id, 1);
    expect(response.body.result).to.be.a('boolean')
    expect(response.body.result).to.be.oneOf([true, false])
  })
})