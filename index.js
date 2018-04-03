const Tx = require('ethereumjs-tx')
const solc = require('solc')
// Connect to local Ethereum node
const Web3 = require('web3')

class testiero {
  constructor(provider, privateKey) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(provider))
    this.deployer = this.web3.eth.accounts.privateKeyToAccount('0x' + privateKey).address
    this.privateKey = new Buffer(privateKey, 'hex')
  }

  sendSigned(txData) {
    return new Promise((resolve, reject) => {
      if (!this.privateKey) reject('Missing private key')
      // Signs the given transaction data and sends it. Abstracts some of the details 
      // of buffering and serializing the transaction for web3.
      const transaction = new Tx(txData)
      transaction.sign(this.privateKey)
      const serializedTx = transaction.serialize().toString('hex')
      this.web3.eth.sendSignedTransaction('0x' + serializedTx)
        .then(resolve)
        .catch(reject)
    })
  }

  compile(file, contract) {
    const input = { [contract]: file }
    const compiledContract = solc.compile({ sources: input })
    const output = compiledContract.contracts[`${contract}:${contract}`]
    const gasEstimates = output.gasEstimates
    const abi = JSON.parse(output.interface)
    const bytecode = '0x' + output.bytecode
    return { abi, bytecode, contract, gasEstimates }
  }


  deploy(output, args) {
    const { abi, bytecode, contract } = output

    const instance = new this.web3.eth.Contract(abi)

    const hexdata = instance.deploy({ data: bytecode, arguments: args })
      .encodeABI()
    // get the number of transactions sent so far so we can create a fresh nonce
    return new Promise((resolve, reject) =>
      this.web3.eth.getTransactionCount(this.deployer)
        .then(txCount => this.sendSigned({
          nonce: this.web3.utils.toHex(Number(txCount)),
          data: hexdata,
          gasLimit: this.web3.utils.toHex(4500000),
          gasPrice: this.web3.utils.toHex(20e9), // 20 Gwei
          from: this.deployer,
        })).then(instance => this.web3.eth.getTransactionReceipt(instance.transactionHash))
        .then((receipt) => resolve(receipt))
        .catch(reject)
    )
  }
}


module.exports = testiero