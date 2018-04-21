var bitcoin = require('bitcoinjs-lib'); // npm install bitcoinjs-lib
var keyPair = bitcoin.ECPair.makeRandom();

// public key address
console.log(keyPair.getAddress());

// private key (in WIF format)
console.log(keyPair.toWIF());