const Tx = require('ethereumjs-tx')
const solc = require('solc')
// Connect to local Ethereum node
const Web3 = require('web3')

class testiero {
  constructor(provider, privateKey) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(provider))
    this.deployer = this.web3.eth.accounts.privateKeyToAccount('0x' + privateKey).address
    this.privateKey = privateKey
  }

  sendSigned(txData) {
    return new Promise((resolve, reject) => {
      if (!this.privateKey) reject('Missing private key')
      this.privateKey = new Buffer(this.privateKey, 'hex')
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
    const abi = JSON.parse(compiledContract.contracts[`${contract}:${contract}`].interface)
    const bytecode = '0x' + compiledContract.contracts[`${contract}:${contract}`].bytecode
    return { abi, bytecode, contract }
  }
  
  
  deploy(output, args) {
    const { abi, bytecode, contract } = output
    // get the number of transactions sent so far so we can create a fresh nonce
    return new Promise((resolve, reject) =>
      this.web3.eth.getTransactionCount(this.deployer)
        .then(txCount => this.sendSigned({
          nonce: this.web3.utils.toHex(Number(txCount)),
          data: bytecode,
          arguments: args,
          gasLimit: this.web3.utils.toHex(4500000),
          gasPrice: this.web3.utils.toHex(10e9), // 10 Gwei
          from: this.deployer,
        })).then((result) => resolve(result.contractAddress))
        .catch(reject)
    )
  }
}


module.exports = testiero