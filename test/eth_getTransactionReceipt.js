const supertest = require('supertest')
const expect = require('chai').expect
const request = supertest(process.env.ETH_JSON_RPC_URL)

const payload = {
  jsonrpc: "2.0",
  method: "eth_getTransactionReceipt",
  params: [],
  id: 1
}

describe('happy path', function () {
  it('returns the receipt of the transaction by transaction hash', async function () {
    payload.params = [
      '0x7eb8b4c40d664f9e342068fcfbfffdd6654eedd0a5a27d5ef3d52f86a698c82c'
    ]
    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc, "2.0");
    expect(response.body.id, 1);
    expect(response.body.result).to.contain.all.keys(
      'blockHash',
      'blockNumber',
      'contractAddress',
      'cumulativeGasUsed',
      'effectiveGasPrice',
      'from',
      'gasUsed',
      'logs',
      'logsBloom',
      'status',
      'to',
      'transactionHash',
      'transactionIndex',
      'type');
  })
})

describe('no/pending receipt', function () {
  it('should return result null', async function () {
    payload.params = [
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
    ]
    const response = await request
      .post('/')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.jsonrpc, "2.0");
    expect(response.body.id, 1);
    expect(response.body.result).to.be.null;
  })
})