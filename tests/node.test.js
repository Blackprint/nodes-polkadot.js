/**
 * @jest-environment node
 */

let window = globalThis;
require("@blackprint/engine");

// Force it as Node.js environment because jest environment seems mixed up
Blackprint.Environment.isBrowser = false;
Blackprint.Environment.isNode = true;


let instance = null;
test('Blackprint does exist on window', async () => {
  expect(window.Blackprint).toBeDefined();

	// Create an instance where we can create nodes or import JSON
	instance = new Blackprint.Engine();
});

jest.setTimeout(60e3); // 1 minute

// This may took longer to finish because will also load polkadot.js's module
test("Load required modules", async () => {
	// Alternative for Blackprint.loadModuleFromURL(...);
	await import("../dist/nodes-polkadotjs.mjs"); // For Browser/Node.js

	// Wait and avoid Jest's test environment being torn down
	await Blackprint.getContext('Polkadot.js');
	await new Promise(resolve => setTimeout(resolve, 1000));

	// Check if the nodes has been registered
	expect(Blackprint.nodes['Polkadot.js']).toBeDefined();
});

test("Create WebSocket node", async () => {
	instance.createNode('Polkadot.js/Connection/WebSocket', {id: 'WS_RPC'});
	expect(instance.iface.WS_RPC).toBeDefined();
});