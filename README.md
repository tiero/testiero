# testiero
ultra-opinionated Solidity testing library

### Setup

`npm i testiero`

### Usage 

We have a Solidity file called   `MyContractFile.sol`

```javascript
pragma ^4.20
contract MyContract {
  function MyContract(uint a, address b) {
    //doing stuff here
  }
}
```

In our Javascript we do 

```javascript

const privatekey = process.env["privateKey"] // without 0x
const Testiero = require('testiero')
const testiero = new Testiero('https://ropsten.infura.io/<apiKey>', privateKey)

const sourceFileString = fs.readFileSync('./MyContractFile.sol','utf8')

//Compile it
const output = testiero.compile(sourceFileString, 'MyContract')

//Gas estimation
const estimates = output.gasEstimates.creation
console.log('Gas estimate', Number(estimates[0]) + Number(estimates[1]))

//Deploy using the compile output and passing if needed the constructor arguments array
testiero.deploy(output, [300000,"0x123.."])
.then(receipt => console.log(`deployed contract ${receipt.contractAddress} \nGas used ${receipt.gasUsed}`))
.catch(console.error)



```