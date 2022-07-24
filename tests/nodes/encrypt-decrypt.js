/**
 * 'MyInstance' is instance of:
 * 1. Blackprint.Sketch if created from '../browser.test.js' - for Browser environment
 * 2. Blackprint.Engine if created from '../node.test.js' - for Node.js environment
 */

// This test will be run after
// - tests/nodes/import-mnemonic.js

let polkadotUtil = require('@polkadot/util');

describe("Encrypt and decrypt data", () => {
	let textData = "hello world";
	let bytesData = "104,101,108,108,111,32,119,111,114,108,100";

	// Create some output port
	let outText = new Blackprint.OutputPort(String);
	let outBytes = new Blackprint.OutputPort(Uint8Array);

	// Put our unencrypted data in the port
	outText.value = textData;
	outBytes.value = new Uint8Array(bytesData.split(','));

	let Decrypt, Encrypt;
	test("Create Encrypt and Decrypt node", async () => {
		Decrypt = MyInstance.createNode("Polkadot.js/Data/Keyring/Decrypt", {id: 'Decrypt'});
		Encrypt = MyInstance.createNode("Polkadot.js/Data/Keyring/Encrypt", {id: 'Encrypt'});

		// Connect "Encrypt.Bytes" to "Decrypt.Data"
		//> Decrypt.data = Encrypt.bytes
		Encrypt.output.Bytes.connectPort(Decrypt.input.Data);
	});

	test("Encrypt text data from Keypair A and decrypt with Keypair B", async () => {
		let { Keypair_Node_A, Keypair_Node_B } = MyInstance.iface;
		// - Keypair_Node_A = Wallet_A's keypair
		// - Keypair_Node_B = Wallet_B's keypair

		//> Encrypt.keypair = KeypairA.keypair (wallet A)
		Encrypt.input.Keypair.connectPort(Keypair_Node_A.output.Keypair);

		//> Decrypt.keypair = KeypairB.keypair (wallet B)
		Decrypt.input.Keypair.connectPort(Keypair_Node_B.output.Keypair);

		// "Encrypt" node is connected to Keypair_Node_A, we want the data to be decrypted by Keypair_Node_B
		//> Encrypt.target = KeypairB.address (wallet B)
		Encrypt.input.Target.connectPort(Keypair_Node_B.output.Address);

		// "Decrypt" node is connected to Keypair_Node_B, the data author is Keypair_Node_A
		//> Decrypt.author = KeypairA.address (wallet A)
		Decrypt.input.Author.connectPort(Keypair_Node_A.output.Address);

		// Initially this should be null or have no data because it haven't encrypted anything
		//> Encrypt.bytes === null
		expect(Encrypt.ref.Output.Bytes).toBe(null);

		// Encrypt.data = 'hello world'
		Encrypt.input.Data.connectPort(outText);

		// The encrypt node output the encrypted data
		//> Encrypt.bytes !== null
		expect(Encrypt.ref.Output.Bytes).not.toBe(null);

		// "Encrypt" node already connected with "Decrypt" node
		// so the "Decrypt" node should have new value right now

		// Let's check if the value is similar
		//> u8aToString( Encrypt.bytes ) === 'hello world'
		expect(polkadotUtil.u8aToString(Decrypt.ref.Output.Bytes)).toBe(textData);
	});

	test("Encrypt Uint8Array data from Keypair B and decrypt with Keypair A", async () => {
		let { Keypair_Node_A, Keypair_Node_B } = MyInstance.iface;

		// Disconnect cable that connected to "Encrypted.Data" port
		Encrypt.input.Data.disconnectAll();

		//> Encrypt.keypair = KeypairB.keypair (wallet B)
		Encrypt.input.Keypair.connectPort(Keypair_Node_B.output.Keypair);

		//> Decrypt.keypair = KeypairA.keypair (wallet A)
		Decrypt.input.Keypair.connectPort(Keypair_Node_A.output.Keypair);

		// "Encrypt" node is connected to Keypair_Node_B, we want the data can only be decrypted by Keypair_Node_A
		//> Encrypt.target = KeypairA.address (wallet A)
		Encrypt.input.Target.connectPort(Keypair_Node_A.output.Address);

		// "Decrypt" node is connected to Keypair_Node_A, the data author is Keypair_Node_B
		//> Decrypt.author = KeypairB.address (wallet B)
		Decrypt.input.Author.connectPort(Keypair_Node_B.output.Address);

		// Initially this should be null or have no data because it haven't encrypted anything
		//> Encrypt.bytes === null
		expect(Encrypt.ref.Output.Bytes).toBe(null);

		// Encrypt.data = Uint8Array([104,101,108,108,111,32,119,111,114,108,100])
		Encrypt.input.Data.connectPort(outBytes);

		// The encrypt node output the encrypted data
		//> Encrypt.bytes !== null
		expect(Encrypt.ref.Output.Bytes).not.toBe(null);

		// "Encrypt" node already connected with "Decrypt" node
		// so the "Decrypt" node should have new value right now

		// Let's check if the value is similar
		//> Decrypt.bytes.toString() === "104,101,108,108,111,32,119,111,114,108,100"
		expect(Decrypt.ref.Output.Bytes.toString()).toBe(bytesData);
	});
});