/**
 * 'MyInstance' is instance of:
 * 1. Blackprint.Sketch if created from '../browser.test.js' - for Browser environment
 * 2. Blackprint.Engine if created from '../node.test.js' - for Node.js environment
 */

// Sometime this test will fail if the testnet isn't reachable or responds with HTTP 503
// If it does fail, please re-run the test after few seconds

describe("WebSocket Provider Node", () => {
	let WS_RPC = null; // type: WebSocketIFace -> src/Connection/WebSocket.js

	test("Create nodes", async () => {
		WS_RPC = MyInstance.createNode('Polkadot.js/Connection/WebSocket', {id: 'WS_RPC'});
		expect(MyInstance.iface.WS_RPC).toBeDefined();
	});

	test("Connect to Westend", (done) => {
		// This output port will be called when we get connected to the network
		WS_RPC.output.Connected.once('call', done);

		// Changing the RPC URL will trigger reconnection
		WS_RPC.data.rpcURL = 'wss://westend-rpc.polkadot.io/';
	});

	test("Get current block number via RPC", (done) => {
		let { Output, IOutput } = WS_RPC.ref;

		// Wait until the API port has new value (polkadotApi.ApiPromise) after connected to the network
		IOutput.API.once('value', async () => {
			// `Output.API` is type of `polkadotApi.ApiPromise`
			let data = await Output.API.rpc.chain.getBlock();
			let blockNumber = data.block.header.number.toNumber();

			// At least, not zero or NaN
			expect(blockNumber).toBeGreaterThanOrEqual(1);
			done();
		});
	});

	test("Delete nodes", (done) => {
		// This output port will be called when we disconnected from the network
		WS_RPC.output.Disconnected.once('call', done);

		// Deleting the node will destroy the node and the WebSocket connection
		MyInstance.deleteNode(WS_RPC);

		expect(MyInstance.iface.WS_RPC).not.toBeDefined();
	});
});


describe("HTTP Provider Node", () => {
	let HTTP_RPC = null; // type: HTTPIFace -> src/Connection/HTTP.js

	test("Create nodes", async () => {
		HTTP_RPC = MyInstance.createNode('Polkadot.js/Connection/HTTP', {id: 'HTTP_RPC'});
		expect(MyInstance.iface.HTTP_RPC).toBeDefined();
	});

	test("Connect to Westend", (done) => {
		// This output port will be called when we get connected to the network
		HTTP_RPC.output.Connected.once('call', done);

		// Changing the RPC URL will trigger reconnection
		HTTP_RPC.data.rpcURL = 'https://westend-rpc.polkadot.io/';
	});

	test("Get current block number via RPC", async () => {
		let Output = HTTP_RPC.ref.Output;

		// `Output.API` is type of `polkadotApi.ApiPromise`
		expect(Output.API).toBeDefined();

		let data = await Output.API.rpc.chain.getBlock();
		let blockNumber = data.block.header.number.toNumber();

		// At least, not zero or NaN
		expect(blockNumber).toBeGreaterThanOrEqual(1);
	});

	test("Delete nodes", (done) => {
		// This output port will be called when we disconnected from the network
		HTTP_RPC.output.Disconnected.once('call', done);

		// Deleting the node will destroy the node and the HTTP provider
		MyInstance.deleteNode(HTTP_RPC);

		expect(MyInstance.iface.HTTP_RPC).not.toBeDefined();
	});
});