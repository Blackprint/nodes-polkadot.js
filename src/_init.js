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
if(window.Blackprint.Environment.isNode) { // Untested
	crypto = require('crypto').webcrypto;
	polkadotApi = require('@polkadot/api');
	polkadotKeyring = require('@polkadot/keyring');
	polkadotTypes = require('@polkadot/types');
	polkadotUtilCrypto = require('@polkadot/util-crypto');
	polkadotUtil = require('@polkadot/util');
}
else{
	/* Parallely load dependencies from CDN */
	// Use bundled file
	// This will be registered on global (window)
	let _remoteModule = [
		"https://cdn.jsdelivr.net/npm/@polkadot/util@8.2.3-29/bundle-polkadot-util.js",
		"https://cdn.jsdelivr.net/npm/@polkadot/util-crypto@8.2.3-29/bundle-polkadot-util-crypto.js",
		"https://cdn.jsdelivr.net/npm/@polkadot/keyring@8.2.3-29/bundle-polkadot-keyring.js",
		"https://cdn.jsdelivr.net/npm/@polkadot/types@7.2.2-8/bundle-polkadot-types.js",
		"https://cdn.jsdelivr.net/npm/@polkadot/api@7.2.2-8/bundle-polkadot-api.js",
	];

	if(window.Blackprint.Environment.isDeno) { // Untested
		for (var i = 0; i < _remoteModule.length; i++)
			await import(_remoteModule[i]);
	}
	else { // For Browser environment
		_remoteModule.push("https://cdn.jsdelivr.net/npm/@polkadot/extension-dapp@0.42.4/bundle-polkadot-extension-dapp.js");
		await sf.loader.js(_remoteModule, {ordered: true});
	}

	({ polkadotApi, polkadotKeyring, polkadotTypes, polkadotUtilCrypto, polkadotUtil } = window);
	// polkadotExtensionDapp library is not using UMD
}

// Global shared context
var Context = Blackprint.createContext('Polkadot.js');

// This is needed to avoid duplicated event listener when using hot reload
// Event listener that registered with same slot will be replaced7
Context.EventSlot = {slot: 'my-private-event-slot'};

// Bootstrap for add toast on node decoration
class NodeToast {
	constructor(iface){
		this.iface = iface;
	}

	clear(){
		if(this.haveInfo)
			this.haveInfo.destroy();
		if(this.haveWarn)
			this.haveWarn.destroy();
		if(this.haveError)
			this.haveError.destroy();

		this.haveInfo = false;
		this.haveWarn = false;
		this.haveError = false;
	}

	_reduceText(text){
		return text.replace(/\w{15,}/g, full => full.slice(0, 5)+'...');
	}

	info(text){
		if(!this.iface.$decoration) return;
		let temp = text;
		text = this._reduceText(text);

		if(this.haveInfo)
			this.haveInfo.text = text;
		else
			this.haveInfo = this.iface.$decoration.info(text);

		this.haveInfo._raw = temp;
	}

	warn(text){
		if(!this.iface.$decoration) return;
		let temp = text;
		text = this._reduceText(text);

		if(this.haveWarn)
			this.haveWarn.text = text;
		else
			this.haveWarn = this.iface.$decoration.warn(text);

		this.haveWarn._raw = temp;
	}

	error(text){
		if(!this.iface.$decoration) return;
		let temp = text;
		text = this._reduceText(text);

		if(this.haveError)
			this.haveError.text = text;
		else
			this.haveError = this.iface.$decoration.error(text);

		this.haveError._raw = temp;
	}

	success(text){
		if(!this.iface.$decoration) return;
		let ref = this.iface.$decoration.success(this._reduceText(text));
		ref._raw = text;
	}
}

Context.NodeToast = NodeToast;

// Custom class: for Port's type check
class Transaction {
	constructor(txn){this.txn = txn}
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