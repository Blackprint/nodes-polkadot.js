/**
 * 'MyInstance' is instance of:
 * 1. Blackprint.Sketch if created from '../browser.test.js' - for Browser environment
 * 2. Blackprint.Engine if created from '../node.test.js' - for Node.js environment
 */

let polkadotKeyring = require('@polkadot/keyring');

describe("Converter nodes", () => {
	let RandomSeed;

	test("Create random seeds", () => {
		RandomSeed = MyInstance.createNode('Polkadot.js/Keyring/RandomSeed');
		expect(RandomSeed).toBeDefined();
	});

	afterAll(() => {
		MyInstance.deleteNode(RandomSeed);
	});

	test("Address to address", () => {
		let iface = MyInstance.createNode('Polkadot.js/Convert/Address To/Address');

		let address = new Blackprint.OutputPort(String);
		address.value = "5GqT7pbxcp6FK3EAy9a3nXf9U6YP5ifgCadHhSnqs9vMAWR1"; // ChainId: 42
		iface.input.Address.connectPort(address);

		// ss58Format for Polkadot
		let chain0 = new Blackprint.OutputPort(Number);
		chain0.value = 0;

		iface.input.ChainId.connectPort(chain0);
		expect(iface.ref.Output.Address).toBe("15mkG9s2UbMikaEgvnd3vgVJKiY2n2DpH5MmrjnCREwsLsnN");

		// ss58Format for Kusama
		let chain2 = new Blackprint.OutputPort(Number);
		chain2.value = 2;

		iface.input.ChainId.connectPort(chain2);
		expect(iface.ref.Output.Address).toBe("HM4n8wqFB7B4h3cjrP6gV29cgpctPUrexU3674oLx8qugfa");

		// ss58Format for similar ChainId
		let chain42 = new Blackprint.OutputPort(Number);
		chain42.value = 42;

		iface.input.ChainId.connectPort(chain42);
		expect(iface.ref.Output.Address).toBe("5GqT7pbxcp6FK3EAy9a3nXf9U6YP5ifgCadHhSnqs9vMAWR1");
		MyInstance.deleteNode(iface);
	});

	test("Address to Uint8Array", () => {
		let iface = MyInstance.createNode('Polkadot.js/Convert/Address To/Uint8Array');

		RandomSeed.output.Address.connectPort(iface.input.Address);
		let addressInU8A = polkadotKeyring.decodeAddress(RandomSeed.ref.Output.Address);

		expect(iface.ref.Output.Bytes).toStrictEqual(addressInU8A);
		MyInstance.deleteNode(iface);
	});

	test("String to Uint8Array", () => {
		let iface = MyInstance.createNode('Polkadot.js/Convert/String To/Uint8Array');

		let port = new Blackprint.OutputPort(String);
		port.value = "ABCD";

		iface.input.In.connectPort(port);
		expect(iface.ref.Output.Out).toStrictEqual(new Uint8Array([65, 66, 67, 68]));

		// iface.input.In.disconnectAll();
		MyInstance.deleteNode(iface);
	});

	test("Uint8Array to Hex", () => {
		let iface = MyInstance.createNode('Polkadot.js/Convert/Uint8Array To/Hex');
		
		let port = new Blackprint.OutputPort(Uint8Array);
		port.value = new Uint8Array([65, 66, 67, 68]);

		iface.input.In.connectPort(port);
		expect(iface.ref.Output.Out).toBe("0x41424344");

		MyInstance.deleteNode(iface);
	});

	test("Uint8Array to String", () => {
		let iface = MyInstance.createNode('Polkadot.js/Convert/Uint8Array To/String');

		let port = new Blackprint.OutputPort(Uint8Array);
		port.value = new Uint8Array([65, 66, 67, 68]);

		iface.input.In.connectPort(port);
		expect(iface.ref.Output.Out).toBe("ABCD");

		MyInstance.deleteNode(iface);
	});

	test("Mnemonic to Seed", () => {
		let iface = MyInstance.createNode('Polkadot.js/Convert/Mnemonic');

		let port = new Blackprint.OutputPort(String);
		port.value = "sample split bamboo west visual approve brain fox arch impact relief smile";

		let seedU8A = new Uint8Array([159, 161, 171, 29, 55, 2, 93, 140, 60, 213, 150, 236, 191, 80, 67, 85, 114, 238, 174, 177, 120, 90, 12, 158, 210, 178, 42, 250, 76, 55, 141, 106]);

		iface.input.Text.connectPort(port);
		expect(iface.ref.Output.Seed).toStrictEqual(seedU8A);

		MyInstance.deleteNode(iface);
	});
});