/**
 * 'MyInstance' is instance of:
 * 1. Blackprint.Sketch if created from '../browser.test.js' - for Browser environment
 * 2. Blackprint.Engine if created from '../node.test.js' - for Node.js environment
 */

// Event/Subscriptions is only available when using WebSocket Provider

describe("Event Node - Listen for new heads/blocks", () => {
	let WS_Node, Event_Node;

	test("Create nodes", async () => {
		MyInstance.createNode('Polkadot.js/Connection/WebSocket', {id: 'WS_Node'});
		MyInstance.createNode('Polkadot.js/Events/Blocks', {id: 'Event_Node'});

		expect(MyInstance.iface.WS_Node).toBeDefined();
		expect(MyInstance.iface.Event_Node).toBeDefined();

		// Deconstruct it and save to the outer scope of this test function
		({ WS_Node, Event_Node } = MyInstance.iface);
	});

	test("Connect to Westend", (done) => {
		// This output port will be called when we get connected to the network
		WS_Node.output.Connected.once('call', done);

		// Changing the RPC URL will trigger reconnection
		WS_Node.data.rpcURL = 'wss://westend-rpc.polkadot.io/';
	});

	test("Listen for new blocks on Westend network", (done) => {
		// Connect the output port (API) of WS_Node
		// to input port (API) of Event_Node
		WS_Node.output.API.connectPort(Event_Node.input.API);

		// After the 'API' was sent from WS_Node's output port
		// into Event_Node's input port
		// Event_Node will begin listening for new heads/blocks

		// Listen to new output value on Event_Node
		Event_Node.output.Number.on('value', function({ port }){
			// At least, not zero or NaN
			expect(port.value).toBeGreaterThanOrEqual(1);

			// Alright, done for this test if no error
			done();
		});
	});

	test("Delete nodes", (done) => {
		// This output port will be called when we disconnected from the network
		WS_Node.output.Disconnected.once('call', done);

		// Deleting the node will destroy the node and the WS provider
		MyInstance.deleteNode(WS_Node);
		MyInstance.deleteNode(Event_Node);

		expect(MyInstance.iface.WS_Node).not.toBeDefined();
		expect(MyInstance.iface.Event_Node).not.toBeDefined();
	});
});