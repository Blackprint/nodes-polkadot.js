// Let the Blackprint Editor know the source URL where
// the registerNode and registerInterface belongs to
var Blackprint = window.Blackprint.loadScope({
	// You can find the URL on Blackprint menu -> Modules
	// This will also be exported to JSON if this module's nodes is being used
	url: import.meta.url,

	// This will autoload (*.sf.mjs) and (*.sf.css) file for Browser
	hasInterface: true,
});

// Prepare variable
var polkadotApi, polkadotKeyring, polkadotTypes, polkadotUtilCrypto, polkadotUtil;

// Import for different environment
let crypto = window.crypto;
if(Blackprint.Environment.loadFromURL === false) {
	if(window.Blackprint.Environment.isNode)
		crypto = (await import('node:crypto')).webcrypto;

	let path = 'file:///'+process.cwd();

	// Use the bundled version
	await import(path+'/node_modules/@polkadot/util/bundle-polkadot-util.js');
	await import(path+'/node_modules/@polkadot/util-crypto/bundle-polkadot-util-crypto.js');
	await import(path+'/node_modules/@polkadot/keyring/bundle-polkadot-keyring.js');
	await import(path+'/node_modules/@polkadot/types/bundle-polkadot-types.js');
	await import(path+'/node_modules/@polkadot/api/bundle-polkadot-api.js');

	if(window.Blackprint.Environment.isBrowser)
		await import(path+'/node_modules/@polkadot/extension-dapp/bundle-polkadot-extension-dapp.js');
	
	({ polkadotApi, polkadotKeyring, polkadotTypes, polkadotUtilCrypto, polkadotUtil, polkadotExtensionDapp } = window);
}
else{
	/* Parallely load dependencies from CDN */
	// Use bundled file
	// This will be registered on global (window)
	let _remoteModule = [
		"https://cdn.jsdelivr.net/npm/@polkadot/util@^8.4.1/bundle-polkadot-util.min.js",
		"https://cdn.jsdelivr.net/npm/@polkadot/util-crypto@^8.4.1/bundle-polkadot-util-crypto.min.js",
		"https://cdn.jsdelivr.net/npm/@polkadot/keyring@^8.4.1/bundle-polkadot-keyring.min.js",
		"https://cdn.jsdelivr.net/npm/@polkadot/types@^7.9.1/bundle-polkadot-types.min.js",
		"https://cdn.jsdelivr.net/npm/@polkadot/api@^7.9.1/bundle-polkadot-api.min.js",
	];

	if(window.Blackprint.Environment.isDeno) { // Untested
		for (var i = 0; i < _remoteModule.length; i++)
			await import(_remoteModule[i]);
	}
	else { // For Browser environment
		_remoteModule.push("https://cdn.jsdelivr.net/npm/@polkadot/extension-dapp@0.42.9/bundle-polkadot-extension-dapp.js");
		await sf.loader.js(_remoteModule, {ordered: true});
	}

	({ polkadotApi, polkadotKeyring, polkadotTypes, polkadotUtilCrypto, polkadotUtil, polkadotExtensionDapp } = window);
}


// Global shared context
var Context = Blackprint.createContext('Polkadot.js');

// This is needed to avoid duplicated event listener when using hot reload
// Event listener that registered with same slot will be replaced
Context.EventSlot = {slot: 'my-private-event-slot'};

// internal Keyring that will be used by some node if not connected to any keyring
var internalKeyring = new polkadotApi.Keyring({
	type: 'ed25519',
	ss58Format: 0,
});

// Custom class: for Port's type check
class Transaction {
	constructor(txn, api, isBatch){
		this.txn = txn;
		this.api = api;
		this.isBatch = isBatch;
	}
}

class Signer {
	constructor(isPair, address, signer){
		this.isPair = isPair;
		this.address = address;
		this.signer = signer;
	}
}


// Fix minified class name
Blackprint.utils.renameTypeName({
	'Transaction': Transaction,
	'Signer': Signer,
	'ApiPromise': polkadotApi.ApiPromise,
	'Keyring': polkadotApi.Keyring,
	'WsProvider': polkadotApi.WsProvider,
	'HttpProvider': polkadotApi.HttpProvider,
});