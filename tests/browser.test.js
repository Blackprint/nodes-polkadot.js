/**
 * @jest-environment jsdom
 */

require("../../../engine-js/dist/engine.min.js");
// require("@blackprint/engine");

// === For Browser Environment ===
window.ResizeObserver = class{};
window.sf = require("scarletsframe/dist/scarletsframe.min.js");

// Disable loader for browser, because we're testing with Node.js
sf.loader.turnedOff = true;
sf.loader.task = false;

require("../../../dist/blackprint.min.js");
require("../../../dist/blackprint.sf.js");
// require("@blackprint/sketch/dist/blackprint.min.js");
// require("@blackprint/sketch/dist/blackprint.sf.js");
// === For Browser Environment ===


let instance = null;
test('Blackprint.Sketch does exist on window', async () => {
	expect(window.Blackprint.Sketch).toBeDefined();

	// Create an instance where we can create nodes or import JSON
	instance = new Blackprint.Sketch();
});

jest.setTimeout(60e3); // 1 minute

// This may took longer to finish because will also load polkadot.js's module
test("Load required modules", async () => {
	// Force it as Node.js environment because we can't load module with URL
	Blackprint.Environment.isBrowser = false;
	Blackprint.Environment.isNode = true;

	// Alternative for Blackprint.loadModuleFromURL(...);
	await import("../dist/nodes-polkadotjs.mjs"); // For Browser/Node.js
	await import("../dist/nodes-polkadotjs.sf.mjs"); // For Browser UI

	// Wait and avoid Jest's test environment being torn down
	await Blackprint.getContext('Polkadot.js');
	await new Promise(resolve => setTimeout(resolve, 1000));

	// Reset to browser environment
	Blackprint.Environment.isBrowser = true;
	Blackprint.Environment.isNode = false;

	// Check if the nodes has been registered
	expect(Blackprint.nodes['Polkadot.js']).toBeDefined();
});

test("Create WebSocket node", async () => {
	instance.createNode('Polkadot.js/Connection/WebSocket', {id: 'WS_RPC'});
	expect(instance.iface.WS_RPC).toBeDefined();
});