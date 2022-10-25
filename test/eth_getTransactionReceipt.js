const supertest = require('supertest')
const assert = require('assert')
const expect = require('chai').expect
const request = supertest(process.env.ETH_JSON_RPC_URL)

const payload = {
  jsonrpc: "2.0",
  method: "eth_getTransactionReceipt",
  params: [],
  id: 1
}

describe('eth_getTransactionReceipt', function () {
  describe('happy path', function () {
    it('should return the receipt of the transaction', async function () {
      payload.params = [
        "0x621db92c957bfd645e30529dd7df612cd95c3c14a3b9896c204739903308d0c8"
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
        "0xd35d815ee71abe580283fd43f5a92184eb07e4a5c09c8aeb609e391d378fffff"
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
})