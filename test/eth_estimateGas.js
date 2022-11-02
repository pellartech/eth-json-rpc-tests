const supertest = require('supertest')
const expect = require('chai').expect
const request = supertest(process.env.ETH_JSON_RPC_URL)
const ethers = require("ethers")

const payload = {
  jsonrpc: "2.0",
  method: "eth_estimateGas",
  params: [],
  id: 1
}

describe('happy path', function () {
  it('returns an estimate of how much gas (as hex) is necessary for allow the transaction to complete', async function () {
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

describe('set contract store value 5', function () {
  it('eturns an estimate of how much gas (as hex) is necessary for allow the transaction to complete', async function () {
    payload.params = [
      {
        to: '0x51057a8f5561d46a460ebfaf00c61e6501fe9410',//global.CONTRACT_ADDRESS,
        data: '0x6057361d0000000000000000000000000000000000000000000000000000000000000005'
      },
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
    expect(response.body.result).to.equal('0x52d4')
  })
})

describe('trigger revert', function () {
  it('eturns an estimate of how much gas (as hex) is necessary for allow the transaction to complete', async function () {
    payload.params = [
      {
        to: '0x51057a8f5561d46a460ebfaf00c61e6501fe9410',//global.CONTRACT_ADDRESS,
        data: '0xffae399e0000000000000000000000000000000000000000000000000000000000000001'
      },
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
    expect(response.body.result).to.equal('0x52d4')
  })
})