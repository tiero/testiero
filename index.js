const Tx = require('ethereumjs-tx')
const solc = require('solc')
// Connect to local Ethereum node
const Web3 = require('web3')

class testiero {
  constructor(provider) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(provider));
  }

  sendSigned = (txData, privKey) => {
    return new Promise((resolve, reject) => {
      if (!privKey) reject('Missing private key')
      const privateKey = new Buffer(privKey, 'hex')
      // Signs the given transaction data and sends it. Abstracts some of the details 
      // of buffering and serializing the transaction for web3.
      const transaction = new Tx(txData).sign(privateKey)
      const serializedTx = transaction.serialize().toString('hex')
      this.web3.eth.sendSignedTransaction('0x' + serializedTx)
        .then(resolve)
        .catch(reject)
    })
  }
  
  compile = (name, file, contract) => {
    const input = { [name]: file }
    const compiledContract = solc.compile({ sources: input })
    const abi = JSON.parse(compiledContract.contracts[`${name}:${contract}`].interface)
    const bytecode = '0x' + compiledContract.contracts[`${name}:${contract}`].bytecode
    return { abi, bytecode, contract }
  }
  
  
  deploy = (output, args) => {
    const { abi, bytecode, contract } = output
    // get the number of transactions sent so far so we can create a fresh nonce
    return new Promise((resolve, reject) =>
      this.web3.eth.getTransactionCount(addressFrom)
        .then(txCount => sendSigned({
          nonce: this.web3.utils.toHex(Number(txCount)),
          data: bytecode,
          arguments: args,
          gasLimit: this.web3.utils.toHex(1500000),
          gasPrice: this.web3.utils.toHex(10e9), // 10 Gwei
          from: addressFrom,
        })).then((result) => {
          console.log('txHash', result.transactionHash)
          return result.contractAddress
        })
        .then(resolve)
        .catch(reject)
    )
  }
}


module.exports = testiero