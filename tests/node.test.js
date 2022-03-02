/**
 * @jest-environment node
 */

require('./prepare-env.js')('node');
window.MyInstance = null;

test('Blackprint.Engine does exist on window', async () => {
	expect(window.Blackprint.Engine).toBeDefined();

	// Create an instance where we can create nodes or import JSON
	window.MyInstance = new Blackprint.Engine();

	// Throw when any error happen
	MyInstance.on('error', ev => {
		console.error(ev);
		throw new Error("Something was wrong");
	});

	// Remove log when the cable was replaced
	MyInstance.on('cable.replaced', ev => {});
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
	MyInstance.createNode('Polkadot.js/Connection/WebSocket', {id: 'WS_RPC'});
	expect(MyInstance.iface.WS_RPC).toBeDefined();
});

// ToDo
// require('./features.js');