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
      'latest'
    ]
    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc, "2.0");
    expect(response.body.id, 1);
    expect(ethers.utils.isHexString(response.body.result), true)
  })
})