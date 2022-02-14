require("@blackprint/engine");
require("dotenv").config({ path: __dirname+'/../.env' });

// Duck tape to fix error when testing for browser environment
globalThis.window = globalThis;
globalThis.require = require;
globalThis.__filename = __filename;
globalThis.URL = function(){return {href:''}};
globalThis.ResizeObserver = class{};

// Polyfill when testing for browser with Jest
globalThis.fetch = require('node-fetch'); // required by @polkadot/util for doing RPC with HTTP
globalThis.crypto = require('crypto').webcrypto; // required by @polkadot/util-crypto

// Force as Node.js environment to load from node_modules
Blackprint.Environment.isBrowser = false;
Blackprint.Environment.isNode = true;

// Test timeout = 15 sec
// This usually needed for waiting for new heads/blocks
jest.setTimeout(15e3);

// Surpress some warning from @polkadot/util
let warn = console.warn;
console.warn = function(msgA, msgB, msgC){
	if(msgC?.includes != null){
		if(msgC.includes('RPC methods not decorated')) return;
		if(msgC.includes('Api will be available in a limited mode since the provider does not support subscriptions')) return;
	}

	warn.apply(console, arguments);
}

module.exports = function(env){
	if(env === 'browser'){
		// For Browser Environment
		window.sf = require("scarletsframe/dist/scarletsframe.min.js");

		// Disable loader for browser, because we're testing with Node.js
		sf.loader.turnedOff = true;
		sf.loader.task = false;

		require("@blackprint/sketch/dist/blackprint.min.js");
		require("@blackprint/sketch/dist/blackprint.sf.js");
	}
};