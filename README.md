# tesTiero
ultra-opinionated Solidity testing library


### Installation

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
const { compile, deploy } = require('testiero')

const output = compile(
  'MyContractFile.sol', 
  fs.readFileSync('<path>'),
  'MyContract')

deploy(output, [300000,"0x123.."])
.then(address => {
  console.log(`deployed contract at address ${address}`)
  
})
.catch(console.error)



```