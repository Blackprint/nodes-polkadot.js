// Let the Blackprint Editor know the source URL where
// the registerNode and registerInterface belongs to
var Blackprint = window.Blackprint.loadScope({
	// You can find the URL on Blackprint menu -> Modules
	// This will also be exported to JSON if this module's nodes is being used
	url: import.meta.url,

	// This will autoload (*.sf.mjs) and (*.sf.css) file for Browser
	hasInterface: true,

	// This will autoload (*.docs.json) for Browser
	hasDocs: true,
});

// Prepare variable
var polkadotApi, polkadotKeyring, polkadotTypes, polkadotUtilCrypto, polkadotUtil;
var polkadotExtensionDapp;

// Import for different environment
let crypto = window.crypto;
if(Blackprint.Environment.loadFromURL === false) {
	if(window.Blackprint.Environment.isNode){
		crypto = (await import('node:crypto')).webcrypto;

		// Bugfix for polkadot.js's dependency library
		window.addEventListener ??= ()=>{};

		// We can't use the bundled version because it's currently not for Node.js
		try{
			polkadotUtil = await import('@polkadot/util');
			polkadotUtilCrypto = await import('@polkadot/util-crypto');
			polkadotKeyring = await import('@polkadot/keyring');
			polkadotTypes = await import('@polkadot/types');
			polkadotApi = await import('@polkadot/api');
		} catch(e) {
			console.log(e);
			setTimeout(() => process.exit(), 500);
		}
	}
	else{
		// Use the bundled version for Browser and Deno
		let path = 'file:///'+process.cwd();

		await import(path+'/node_modules/@polkadot/util/bundle-polkadot-util.js');
		await import(path+'/node_modules/@polkadot/util-crypto/bundle-polkadot-util-crypto.js');
		await import(path+'/node_modules/@polkadot/keyring/bundle-polkadot-keyring.js');
		await import(path+'/node_modules/@polkadot/types/bundle-polkadot-types.js');
		await import(path+'/node_modules/@polkadot/api/bundle-polkadot-api.js');

		if(window.Blackprint.Environment.isBrowser)
			await import(path+'/node_modules/@polkadot/extension-dapp/bundle-polkadot-extension-dapp.js');

		({ polkadotApi, polkadotKeyring, polkadotTypes, polkadotUtilCrypto, polkadotUtil } = window);
	}
}
else{
	/* Parallely load dependencies from CDN */
	// Use bundled file
	// This will be registered on global (window)
	let _remoteModule = [
		"https://cdn.jsdelivr.net/npm/@polkadot/util@10/bundle-polkadot-util.min.js",
		"https://cdn.jsdelivr.net/npm/@polkadot/util-crypto@10/bundle-polkadot-util-crypto.min.js",
		"https://cdn.jsdelivr.net/npm/@polkadot/keyring@10/bundle-polkadot-keyring.min.js",
		"https://cdn.jsdelivr.net/npm/@polkadot/types@8/bundle-polkadot-types.min.js",
		"https://cdn.jsdelivr.net/npm/@polkadot/api@8/bundle-polkadot-api.min.js",
	];

	if(window.Blackprint.Environment.isDeno) { // Untested
		for (var i = 0; i < _remoteModule.length; i++)
			await import(_remoteModule[i]);
	}
	else { // For Browser environment
		_remoteModule.push("https://cdn.jsdelivr.net/npm/@polkadot/extension-dapp@0.42.9/bundle-polkadot-extension-dapp.js");
		await sf.loader.js(_remoteModule, {ordered: true});
	}

	({ polkadotApi, polkadotKeyring, polkadotTypes, polkadotUtilCrypto, polkadotUtil } = window);
}

if(window.polkadotExtensionDapp != null)
	polkadotExtensionDapp = window.polkadotExtensionDapp;

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