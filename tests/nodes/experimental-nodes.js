/**
 * 'MyInstance' is instance of:
 * 1. Blackprint.Sketch if created from '../browser.test.js' - for Browser environment
 * 2. Blackprint.Engine if created from '../node.test.js' - for Node.js environment
 */

describe("Experimental generated nodes", () => {
	let WS_RPC;

	beforeAll((done)=> {
		// Create WebSocket node for Pangolin
		WS_RPC = MyInstance.createNode('Polkadot.js/Connection/WebSocket');
		WS_RPC.data.rpcURL = 'wss://pangolin-rpc.darwinia.network';

		// This output port will be called when we get connected to the network
		WS_RPC.output.Connected.once('call', done);
	}, 40e3);

	afterAll(()=> {
		MyInstance.deleteNode(WS_RPC);
	}, 40e3);

	test("Constants", (done) => {
		let iface = MyInstance.createNode('Polkadot.js/Constants/Timestamp/MinimumPeriod');

		// Check if the port have a new value after get connected
		iface.output.u64.on('value', ({ port }) => {
			if(port.value > 0) done();
			else done("Port value must have value greater than 0");

			MyInstance.deleteNode(iface);
		});

		WS_RPC.output.API.connectPort(iface.input.API);
	});
	
	test("Storage", (done) => {
		let iface = MyInstance.createNode('Polkadot.js/Storage/System/Number');

		// Check if the port have a new value after being triggered
		iface.output.u32.on('value', ({ port }) => {
			if(port.value > 0) done();
			else done("Port value must have value greater than 0");

			MyInstance.deleteNode(iface);
		});

		WS_RPC.output.API.connectPort(iface.input.API);
		iface.ref.Input.Trigger();
	});

	test("RPC", (done) => {
		let iface = MyInstance.createNode('Polkadot.js/RPC/System/Name');

		// Check if the port have a new value after being triggered
		iface.output.Text.on('value', ({ port }) => {
			if(port.value != "") done();
			else done("The output must have a name, but found empty string");

			MyInstance.deleteNode(iface);
		});

		WS_RPC.output.API.connectPort(iface.input.API);
		iface.ref.Input.Trigger();
	});

	test("NodeToast's notification UI", () => {
		let toast = WS_RPC._toast;
		toast.info("Test");
		expect(toast.hasInfo).not.toBe(false);

		toast.warn("Test");
		expect(toast.hasWarn).not.toBe(false);

		toast.error("Test");
		expect(toast.hasError).not.toBe(false);

		toast.success("Test");
		toast.clear("Test");
	});
});