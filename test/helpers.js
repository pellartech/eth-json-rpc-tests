const ethers = require('ethers')
const Tx = require('@ethereumjs/tx').Transaction

const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_JSON_RPC_URL)
provider.chainId = process.env.CHAIN_ID
const default_wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

module.exports = {
  async getRawTxn(nonce, gas, gasPrice, to, value, data, wallet = default_wallet) {

    const tx = {
      chainId: parseInt(process.env.CHAIN_ID),
      nonce: ethers.utils.hexlify(nonce),
      gasLimit: ethers.utils.hexlify(gas),
      gasPrice: ethers.utils.hexlify(gasPrice),
      to,
      value: ethers.utils.parseEther(value).toHexString(),
      data,
    }

    const rawTransaction = await wallet.signTransaction(tx).then(ethers.utils.serializeTransaction(tx));
    return rawTransaction
  },
  async getTxnReceipt(hash) {
    const receipt = await provider.getTransactionReceipt(hash)
    return receipt
  }
}

module.exports.provider = provider
module.exports.wallet = default_wallet