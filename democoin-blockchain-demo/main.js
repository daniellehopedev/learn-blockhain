const SHA256 = require('crypto-js/sha256');

class Transaction {
    /**
     * Constructor for transaction instance
     * 
     * @param {string} fromAddress 
     * @param {string} toAddress 
     * @param {number} amount 
     */
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    /**
     * Constructor for creating a Block
     * 
     * @param {string} timestamp - when the block was created
     * @param {object} transactions - any data to associate with the block, details of transaction
     * @param {string} previousHash - contains hash of the previous block
     */
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions
        this.previousHash = previousHash;
        this.hash = this.calculateHash();     // hash of the created block
        this.nonce = 0;     // random value - used in mineBlock method
    }

    /**
     * Caculates the hash of a block
     * Takes the properties of the block and run it through a hash function
     * 
     * @returns hash of the block - will identify the block on the blockchain
     */
    calculateHash() {
        // using SHA256, not available in javascript by defaut
        // need to install and import crypto-js
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    /**
     * Get the hash to begin with a certain amount of zeros based on difficulty
     * Will prevent the mining of lots of blocks very quickly
     * 
     * @param {number} difficulty - will help determine the amount of zeros needed to create a block
     */
    mineBlock(difficulty) {
        // keep looping until we reach a hash that begins with 
        // the amount of zeros designated by difficulty
        // Array(difficulty + 1).join("0") creates an array of all zeros
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            // changing this basically changes the contents of the mined block, which then causes the hash to change
            // otherwise, this will be an endless loop since the hash will not change because the data is the same
            // could be stuck on the hash with the right amount of zeros
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined:", this.hash);
    }
}

class Blockchain {
    /**
     * Constructor to initialize the blockchain
     */
    constructor() {
        this.chain = [this.createGenesisBlock()];    // an array of blocks
        this.difficulty = 2; 
        this.pendingTransactions = [];  // will hold transactions made in between blocks
        this.miningReward = 100;    // the reward for successfully mining
    }
    
    /**
     * Creates this initial block in a chain, genesis block
     * 
     * @returns new Block();
     */
    createGenesisBlock() {
        return new Block("01/01/2023", "Genesis block", "0000");
    }

    /**
     * Get the latest block in the chain
     * 
     * @returns last created block, last element in the chain
     */
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    /**
     * Initializes a block with any pending transactions and mines it
     * after it is mined, it is added to the chain
     * The reward is then sent to the mining reward address (wallet)
     * 
     * @param {string} miningRewardAddress 
     */
    minePendingTransactions(miningRewardAddress){
        // create a new block, initialized with any pending transactions
        let block = new Block(Date.now(), this.pendingTransactions);
        // mine the block
        block.mineBlock(this.difficulty);

        // after successfully mining, add the block to the chain
        console.log('Block successfully mined!');
        this.chain.push(block);

        // reset the pendingTransactions array
        this.pendingTransactions = [ new Transaction(null, miningRewardAddress, this.miningReward) ];

        // side note: in reality, miners get to choose the transaction they want to include
        // there are way too many pending transactions to try to store or try to run them all
    }

    /**
     * Takes a transaction and adds it to pendingTransactions
     *  
     * @param {object} transaction
     * */
    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    /**
     * Checks the balance of the address
     * 
     * @param {string} address
     * 
     * @returns balance
     */
    getBalanceOfAddress(address) {
        let balance = 0;

        // loop over all the blocks in the chain
        for (const block of this.chain) {
            // loop over all transactions in the block
            for (const trans of block.transactions) {
                // giver
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }

                // receiver
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    /**
     * Verify the integrity of the chain, check validity of the chain
     * Loops over the entire chain
     * Check if the blocks are properly linked together
     * 
     * @returns boolean value of whether or not the chain is valid
     */
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            // get currentBlock and previousBlock
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // check if hash is valid
            // compare the set hash to what the has should be based on calculateHash
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false
            }

            // check if the currentBlock previousHash matches the hash of the previous block 
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let democoin = new Blockchain();

democoin.createTransaction(new Transaction('patricks-address', 'squidwards-address', 200));
democoin.createTransaction(new Transaction('squidwards-address', 'patricks-address', 100));

// the addresses in reality would be the public key of someones wallet
// after creating these transactions, they will be pending transactions
// will need to start the miner, to create the block and add it to the chain

console.log('\n Starting the miner...');
democoin.minePendingTransactions('spongebobs-address');
console.log('\n Balance of spongebob is', democoin.getBalanceOfAddress('spongebobs-address'));

// balance will still be 0 here
// in minePendingTransactions, the reward is added to pending transactions
// the reward won't be sent until the next block is mined
console.log('\n Starting the miner again...');
democoin.minePendingTransactions('spongebobs-address');
console.log('\n Balance of spongebob is', democoin.getBalanceOfAddress('spongebobs-address'));