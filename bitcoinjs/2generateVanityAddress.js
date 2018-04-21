var bitcoin = require('bitcoinjs-lib');

while(true)
{
	var keyPair = bitcoin.ECPair.makeRandom();
	// public key address
	var pubAdd  = keyPair.getAddress();

	var vanityAdd = pubAdd.substring(0,4);

	if(vanityAdd.toLowerCase() ==='1sri')
	{
		// private key (in WIF format)
		console.log('vanity private address');
		var priAdd  = keyPair.toWIF();
		console.log(priAdd);
		break;
	}
}