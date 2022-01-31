require("@blackprint/engine");

// Duck tape to fix error when testing with `node --experimental-vm-modules`
globalThis.window = globalThis;
globalThis.require = require;
globalThis.__filename = __filename;

// Looks like we need to fix this from polkadot.js's library 😅
// Let's just use this duck tape for now
// error source: bundle-polkadot-types.js ('typeof location' will never 'undefined')
//  - search "const location = " and "const packageInfo = "
globalThis.URL = function(){return {href:''}};

// Force it as Node.js environment because jest environment seems mixed up
Blackprint.Environment.isBrowser = false;
Blackprint.Environment.isNode = true;

// jest.setTimeout(10e3); // 1 minute

module.exports = function(env){
	if(env === 'browser'){
		// === For Browser Environment ===
		window.ResizeObserver = class{};
		window.sf = require("scarletsframe/dist/scarletsframe.min.js");

		// Disable loader for browser, because we're testing with Node.js
		sf.loader.turnedOff = true;
		sf.loader.task = false;

		require("@blackprint/sketch/dist/blackprint.min.js");
		require("@blackprint/sketch/dist/blackprint.sf.js");
		// === For Browser Environment ===
	}
};