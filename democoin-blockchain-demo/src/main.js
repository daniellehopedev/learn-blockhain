const { Blockchain, Transaction } = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// private key from keygenerator
const myKey = ec.keyFromPrivate('<private-key>');
const myWalletAddress = myKey.getPublic('hex');

let democoin = new Blockchain();

console.log('\nStarting the miner...');
democoin.minePendingTransactions(myWalletAddress);
console.log('\nBalance of my wallet is', democoin.getBalanceOfAddress(myWalletAddress));

const tx1 = new Transaction(myWalletAddress, '<public-key-of-destination-wallet>', 10);
tx1.signTransaction(myKey);
democoin.addTransaction(tx1);

// the tx1 transaction is sitting in the pendingTransactions array
// will need to mine again so that transaction is picked up and the balance is updated
// TODO: fix this flow so the balance update is not behind and does not depend on pendingTransaction cleanup

console.log('\nStarting the miner again...');
democoin.minePendingTransactions(myWalletAddress);
console.log('\nBalance of my wallet is', democoin.getBalanceOfAddress(myWalletAddress));

// the addresses in reality would be the public key of someones wallet
// after creating these transactions, they will be pending transactions
// will need to start the miner, to create the block and add it to the chain

console.log('Is chain valid?', democoin.isChainValid());