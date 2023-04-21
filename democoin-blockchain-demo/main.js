const SHA256 = require('crypto-js/sha256');

class Block {
    /**
     * Contructor for creating a Block
     * 
     * @param {number} index - optional, where the block sits on the chain
     * @param {string} timestamp - when the block was created
     * @param {object} data - any data to associate with the block, details of transaction
     * @param {string} previousHash - contains hash of the previous block
     */
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data
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
        this.difficulty = 5; 
    }
    
    /**
     * Creates this initial block in a chain, genesis block
     * 
     * @returns new Block();
     */
    createGenesisBlock() {
        return new Block(0, "01/01/2023", "Genesis block", "0000");
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
     * Adds a new block to the chain
     * Sets previousHash property of new_block to the last block on the chain
     * Then calculates a new hash value since a property has changed on new_block (previousHash)
     * 
     * @param {Block} new_block 
     */
    addBlock(new_block) {
        new_block.previousHash = this.getLatestBlock().hash;
        // new_block.hash = new_block.calculateHash();
        new_block.mineBlock(this.difficulty);

        this.chain.push(new_block);
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


// Testing mineBlock()
console.log('Mining block 1...');
democoin.addBlock(new Block(1, "04/21/2023", { amount: 30 }));

console.log('Mining block 2...');
democoin.addBlock(new Block(2, "04/22/2023", { amount: 40 }));

// valid case - no tampering - creating and add blocks to the chain
// democoin.addBlock(new Block(1, "04/21/2023", { amount: 10 }));
// democoin.addBlock(new Block(2, "04/22/2023", { amount: 20 }));
// console.log(JSON.stringify(democoin, null, 4));
// console.log('Is blockchain valid?', democoin.isChainValid());

// invalid case
// democoin.chain[1].data = { amount: 500 };
// still invalid with attempt to re-calculate hash
// the relationship to the next block is still broken
// democoin.chain[1].hash = democoin.chain[1].calculateHash();
// console.log('Is blockchain valid?', democoin.isChainValid());