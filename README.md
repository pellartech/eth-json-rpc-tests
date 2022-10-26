
# ETH-JSON-RPC-TESTS

A simple suite of tests which can be used to test an Ethereum JSON-RPC api meets the specification.

Built with Mocha, Supertest, ethers.js and Yarn.

`./test/setup.js` can be modified to change the order of test execution or to remove an RPC method from being tested.


### 1. Install Dependencies
```
yarn
```

### 2. Configure Environment
```
cp .env.example .env
```

### 3. Run tests
```
make test
````