/**
 * 'MyInstance' is instance of:
 * 1. Blackprint.Sketch if created from '../browser.test.js' - for Browser environment
 * 2. Blackprint.Engine if created from '../node.test.js' - for Node.js environment
 */

// After this test, the keyring will be used for another test from another file like
// - decrypt, encrypt node
// - sign, verfy node
// - sending transaction (Work In Progress)
describe("Keyring - Import Mnemonic to a Keypair", () => {
	// This is for testing on the testnet
	// Stored on GitHub Actions's secret and only maintainer/collabolator that can use it
	let mnemonicA = process.env.MNEMONIC_A;
	let mnemonicB = process.env.MNEMONIC_B;

	// Wallet address on Westend testnet
	let chainID = 42;
	let addressA = process.env.WALLET_ADDRESS_A;
	let addressB = process.env.WALLET_ADDRESS_B;

	// Below is the wallet address for testing (https://westend.subscan.io/account/ADDRESS_HERE)
	// Address A: 5Dc4TJ7Ky7LsXpaVZQAeUTsZgKbVSBxZviEw4Gg3P7S4jbYx
	// Address A: 5GjKBG89WT1zvJohwrEm8RgzT5ZGWEyBN4Vgqsvt48aZHsRv

	if(!mnemonicA || !mnemonicB)
		throw new Error("Mnemonic couldn't be found on the current environment, make sure you have created '.env'");

	if(!addressA || !addressB)
		throw new Error("Wallet address couldn't be found on the current environment, make sure you have created '.env'");

	// These nodes will be kept for another test
	test("Create Keyring, and Keypair nodes", async () => {
		/**
		 * Keyring_Node: Keyring is used for storing collection of keypair
		 * Keypair_Node: Keypair can be used for signing data and encrypting message
		 */

		MyInstance.createNode("Polkadot.js/Keyring/Create/Keyring", {id: 'Keyring_Node'});
		MyInstance.createNode("Polkadot.js/Keyring/Create/Keypair", {id: 'Keypair_Node_A'});
		MyInstance.createNode("Polkadot.js/Keyring/Create/Keypair", {id: 'Keypair_Node_B'});
	});

	test("Import mnemonic from environment into a keypair", async () => {
		let { Keyring_Node, Keypair_Node_A, Keypair_Node_B } = MyInstance.iface;

		// Create port and fill it with our mnemonic
		let Port_MnemonicA = new Blackprint.OutputPort(String);
		Port_MnemonicA.value = mnemonicA;

		let Port_MnemonicB = new Blackprint.OutputPort(String);
		Port_MnemonicB.value = mnemonicB;

		// Connect Keyring to the Keypair node
		// The Keypair node will use the Keyring to store it's data
		Keypair_Node_A.input.Keyring.connectPort(Keyring_Node.output.Keyring);
		Keypair_Node_B.input.Keyring.connectPort(Keyring_Node.output.Keyring);

		// Connect our mnemonic port to the Keypair node
		Keypair_Node_A.input.Mnemonic.connectPort(Port_MnemonicA);
		Keypair_Node_B.input.Mnemonic.connectPort(Port_MnemonicB);

		// After the Mnemonic was imported, the Keypair nodes will have some output

		expect(Keypair_Node_A.ref.Output.Keypair).not.toBe(null);
		expect(Keypair_Node_A.ref.Output.Keypair).not.toBe(null);

		// Check if the wallet address length is more than 5
		expect(Keypair_Node_A.ref.Output.Address.length).toBeGreaterThanOrEqual(5);
		expect(Keypair_Node_A.ref.Output.Address.length).toBeGreaterThanOrEqual(5);

		expect(Keypair_Node_A.ref.Output.Signer).not.toBe(null);
		expect(Keypair_Node_A.ref.Output.Signer).not.toBe(null);
	});

	// test("Import mnemonic from environment into a keypair", async () => {
	// 	let { Keyring_Node, Keypair_Node_A, Keypair_Node_B } = MyInstance.iface;
	// });

	// Because the above nodes will being kept for another test
	// let's create separated nodes just for testing if there are
	// some error when destroying the nodes
	test("Create and destroy dummy nodes", async () => {
		// The ID for dummy nodes must be different
		let Keyring = MyInstance.createNode("Polkadot.js/Keyring/Create/Keyring", {id: 'DummyRing'});
		let KeypairA = MyInstance.createNode("Polkadot.js/Keyring/Create/Keypair", {id: 'DummyPairA'});
		let KeypairB = MyInstance.createNode("Polkadot.js/Keyring/Create/Keypair", {id: 'DummyPairB'});
		let Mnemonic = MyInstance.createNode("Polkadot.js/Keyring/Create/Mnemonic", {id: 'Mnemonic'});
		let Seed = MyInstance.createNode("Polkadot.js/Keyring/Create/Seed", {id: 'Seed'});

		// Connect each port
		Keyring.output.Keyring.connectPort(KeypairA.input.Keyring);
		Keyring.output.Keyring.connectPort(KeypairB.input.Keyring);

		// Use random Mnemonic and Seed
		Mnemonic.output.Text.connectPort(KeypairA.input.Mnemonic);
		Seed.output.Seed.connectPort(KeypairB.input.Seed);

		let ring = Keyring.ref.Output.Keyring; // type: polkadotApi.Keyring

		// Check if the keyring contains the Keypair
		expect(ring.getPair(KeypairA.ref.Output.Address)).toBeDefined();
		expect(ring.getPair(KeypairB.ref.Output.Address)).toBeDefined();

		// And the data shoudn't be stored on another Keyring
		// that aren't connected to our dummy Keypair nodes
		let otherRing = MyInstance.iface.Keyring_Node;
		expect(()=> otherRing.getPair(KeypairA.ref.Output.Address)).toThrow();
		expect(()=> otherRing.getPair(KeypairB.ref.Output.Address)).toThrow();

		// Delete every node
		MyInstance.deleteNode(Keyring);
		MyInstance.deleteNode(KeypairA);
		MyInstance.deleteNode(KeypairB);
		MyInstance.deleteNode(Mnemonic);
		MyInstance.deleteNode(Seed);

		// They mustn't remains on the instance
		expect(MyInstance.iface.DummyRing).not.toBeDefined();
		expect(MyInstance.iface.DummyPairA).not.toBeDefined();
		expect(MyInstance.iface.DummyPairB).not.toBeDefined();
		expect(MyInstance.iface.Mnemonic).not.toBeDefined();
		expect(MyInstance.iface.Seed).not.toBeDefined();
	});
});