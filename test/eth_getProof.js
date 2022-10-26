const supertest = require('supertest')
const expect = require('chai').expect
const request = supertest(process.env.ETH_JSON_RPC_URL)
const ethers = require("ethers")

const payload = {
  jsonrpc: "2.0",
  method: "eth_getProof",
  params: [],
  id: 1
}

describe('happy path', function () {
  it('returns the merkle proof for a given account and optionally some storage keys', async function () {
    payload.params = [
      '0xffffffffffffffffffffffffffffffffffffffff'
    ]
    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc, "2.0");
    expect(response.body.id, 1);
    expect(ethers.utils.isHexString(response.body.result), true)
    expect(response.body.result, '0x0000000000000000000000000000000000000000000000000000000000000000')
  })
})