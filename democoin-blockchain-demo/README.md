# Create a Blockchain with JavaScript

### Description:
Simple JavaScript App showing how a blockchain works in the most basic form.
For learning purposes.

### Classes:
- Block: initialize a block
- Blockchain: initializes a chain of Block
- Transaction: details of a transaction - to/from address and amount

### Features:
- create a block
- calculate hash of a block
- add block to a chain
- get the latest block of a chain
- check validity of a chain based on hash values and hash relationship to previous block
- proof of work - controls spamming the creation of blocks
- very simplified functionality of cryptocurrency (multiple transactions in a block and mining reward)
- signing transactions with keys

### TODO:
- does not check if there are enough funds for a transaction
- transactions are hanging in pendingTransactions until a mine or another transaction causes it to be picked up