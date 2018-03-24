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

const Testiero = require('testiero')
const testiero = new Testiero('https://ropsten.infura.io/<apiKey>')

//compile(name, file, contract)
const output = testiero.compile('MyContractFile.sol', fs.readFileSync('<path>'), 'MyContract')

//deploy(output, constructorArguments)
testiero.deploy(output, [300000,"0x123.."])
.then(address => {
  console.log(`deployed contract at address ${address}`)
})
.catch(console.error)



```