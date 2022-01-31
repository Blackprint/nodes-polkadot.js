/**
 * @jest-environment node
 */

require('./prepare-env.js')('node');

let instance = null;
test('Blackprint does exist on window', async () => {
  expect(window.Blackprint).toBeDefined();

	// Create an instance where we can create nodes or import JSON
	instance = new Blackprint.Engine();
});

// This may took longer to finish because will also load polkadot.js's module
// -> Prefer using the bundled version to reduce load time
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