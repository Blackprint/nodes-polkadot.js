/**
 * @jest-environment jsdom
 */

require('./prepare-env.js')('browser');
window.MyInstance = null; // Required for this sequential tests

// Inject Polkadot's browser extension for testing with Jest
require('./utils/inject-browser-extension.js');

// When using Blackprint Editor (https://blackprint.github.io/)
// you can get the instance object with
// window.MyInstance = window.SketchList[0];

test('Blackprint.Sketch does exist on window', async () => {
	expect(window.Blackprint.Sketch).toBeDefined();

	// We want to use Blackprint.Sketch but without any window
	// let's set windowless to true
	Blackprint.settings('windowless', true);

	// Create an instance where we can create nodes or import JSON
	window.MyInstance = new Blackprint.Sketch();

	// Throw when any error happen
	MyInstance.on('error', ev => {
		console.error(ev);
		throw new Error("Something was wrong, please check the console.error");
	});

	// Remove log when the cable was replaced
	MyInstance.on('cable.replaced', ev => {});
});

// This may took longer to finish because will also load polkadot.js's module
// -> Prefer using the bundled version to reduce load time
test("Load required modules", async () => {
	// Force to browser environment
	Blackprint.Environment.isBrowser = true;
	Blackprint.Environment.isNode = false;

	// Alternative for Blackprint.loadModuleFromURL(...);
	await import("../dist/nodes-polkadotjs.mjs"); // For Browser/Node.js
	await import("../dist/nodes-polkadotjs.sf.mjs"); // For Browser UI

	// Wait and avoid Jest's test environment being torn down
	await Blackprint.getContext('Polkadot.js');
	await new Promise(resolve => setTimeout(resolve, 1000));

	// Check if the nodes has been registered
	expect(Blackprint.nodes['Polkadot.js']).toBeDefined();
});

// Let's test the nodes
require('./nodes/http-and-ws-provider.js');
require('./nodes/event-new-heads.js');
require('./nodes/import-mnemonic.js');
require('./nodes/sign-verify.js');
require('./nodes/encrypt-decrypt.js');
require('./nodes/browser-extension.js');
require('./nodes/transfer-balance.js'); // This also contain test for listening balance changes