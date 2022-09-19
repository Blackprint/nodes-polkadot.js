/**
 * 'MyInstance' is instance of:
 * 1. Blackprint.Sketch if created from '../browser.test.js' - for Browser environment
 * 2. Blackprint.Engine if created from '../node.test.js' - for Node.js environment
 */

// This test will be run after
// - tests/nodes/import-mnemonic.js

describe("Sign and verify data", () => {
	let textData = 'hello world';
	let bytesData = '104,101,108,108,111,32,119,111,114,108,100';

	// Create output port
	let outText = new Blackprint.OutputPort(String);
	let outBytes = new Blackprint.OutputPort(Uint8Array);

	// put our data to be signed in the port
	outText.value = textData;
	outBytes.value = new Uint8Array(bytesData.split(','));

	test("Sign text and bytes", async () => {
		// These nodes was created from 'tests/nodes/import-mnemonic.js'
		// it stores a signer from a keypair that was stored in the Keyring
		let { Keypair_Node_A, Keypair_Node_B } = MyInstance.iface;
		// - Keypair_Node_A = Wallet_A's keypair
		// - Keypair_Node_B = Wallet_B's keypair

		// Create data signer node
		MyInstance.createNode("Polkadot.js/Data/Sign", {id: "Data_Signer_A"});
		MyInstance.createNode("Polkadot.js/Data/Sign", {id: "Data_Signer_B"});

		let { Data_Signer_A, Data_Signer_B } = MyInstance.iface;

		// Connect 'Signer_Node' to Data_Signer'
		// Because 'Data/Sign' will need the 'Signer' object from 'Keyring/Get/Signer'
		//> DataSignerA.signer = KeypairA.signer
		//> DataSignerB.signer = KeypairB.signer
		Keypair_Node_A.output.Signer.connectPort(Data_Signer_A.input.Signer);
		Keypair_Node_B.output.Signer.connectPort(Data_Signer_B.input.Signer);

		// Connect 'Data_Signer' to 'Signer_Node'
		//> DataSignerA.data = 'hello world'
		//> DataSignerB.data = '104,101,108,108,111,32,119,111,114,108,100'
		Data_Signer_A.input.Data.connectPort(outText);
		Data_Signer_B.input.Data.connectPort(outBytes);

		// Trigger the node to sign the data
		Data_Signer_A.ref.Input.Trigger();
		Data_Signer_B.ref.Input.Trigger();

		// The data signer will now have the signature of the data (stored in 'Bytes' port)
		// Port 'Output.Bytes' type: Uint8Array
		//> DataSignerA.bytes !== null
		//> DataSignerB.bytes !== null
		expect(Data_Signer_A.ref.Output.Bytes).not.toBe(null);
		expect(Data_Signer_B.ref.Output.Bytes).not.toBe(null);
	});

	let portAddressA, portAddressB;
	test("Verify signed text and bytes with wallet address (public key)", async () => {
		// Create output port
		portAddressA = new Blackprint.OutputPort(String);
		portAddressB = new Blackprint.OutputPort(String);

		// Put our wallet address (public key) in the port
		portAddressA.value = process.env.WALLET_ADDRESS_A;
		portAddressB.value = process.env.WALLET_ADDRESS_B;

		// Create data signer node
		MyInstance.createNode("Polkadot.js/Data/Verify", {id: "Data_Verify_A"});
		MyInstance.createNode("Polkadot.js/Data/Verify", {id: "Data_Verify_B"});

		let { Data_Signer_A, Data_Signer_B } = MyInstance.iface;
		let { Data_Verify_A, Data_Verify_B } = MyInstance.iface;

		// Connect 'Verify' node with the port that contains the wallet address (author)
		//> DataVerifyA.address = process.env.WALLET_ADDRESS_A
		//> DataVerifyB.address = process.env.WALLET_ADDRESS_B
		Data_Verify_A.input.Address.connectPort(portAddressA);
		Data_Verify_B.input.Address.connectPort(portAddressB);

		// Connect output ports that contains signed data (Bytes) to input ports (Signature)
		// - data from Data_Signer_A is signed using Wallet_A
		// - data from Data_Signer_B is signed using Wallet_B
		//
		//> DataVerifyA.signature = DataSignerA.bytes
		//> DataVerifyB.signature = DataSignerB.bytes
		Data_Signer_A.output.Bytes.connectPort(Data_Verify_A.input.Signature);
		Data_Signer_B.output.Bytes.connectPort(Data_Verify_B.input.Signature);

		// Connect our port that contain raw data with input port (Data)
		// - verify text data that was signed using Wallet_A with Data_Verify_A
		// - verify Uint8Array data that was signed using Wallet_B with Data_Verify_B
		//
		//> DataVerifyA.data = 'hello world'
		//> DataVerifyB.data = '104,101,108,108,111,32,119,111,114,108,100'
		outText.connectPort(Data_Verify_A.input.Data);
		outBytes.connectPort(Data_Verify_B.input.Data);

		// The verify port will now have an output
		//> DataVerifyA.isValid === true
		//> DataVerifyB.isValid === true
		expect(Data_Verify_A.ref.Output.IsValid).toBe(true);
		expect(Data_Verify_B.ref.Output.IsValid).toBe(true);
	});

	test("Signature verification fail if the address was different", async () => {
		let { Data_Verify_A, Data_Verify_B } = MyInstance.iface;

		// Put our wallet address (public key) in the port
		portAddressA.value = process.env.WALLET_ADDRESS_A;
		portAddressB.value = process.env.WALLET_ADDRESS_B;

		// Let's test if we switch the wallet, it must be invalid
		// - verify data that was signed using Wallet_B with Data_Verify_A
		// - verify data that was signed using Wallet_A with Data_Verify_B
		//
		//> DataVerifyA.address = process.env.WALLET_ADDRESS_B
		//> DataVerifyB.address = process.env.WALLET_ADDRESS_A
		Data_Verify_A.input.Address.connectPort(portAddressB);
		Data_Verify_B.input.Address.connectPort(portAddressA);

		// The verify port will now have an updated output where the Signature + Data == Invalid (because the address was different)
		//> DataVerifyA.isValid === false
		//> DataVerifyB.isValid === false
		expect(Data_Verify_A.ref.Output.IsValid).toBe(false);
		expect(Data_Verify_B.ref.Output.IsValid).toBe(false);
	});

	// Clean up the nodes
	afterAll(() => {
		let { Data_Signer_A, Data_Signer_B, Data_Verify_A, Data_Verify_B } = MyInstance.iface;

		MyInstance.deleteNode(Data_Signer_A);
		MyInstance.deleteNode(Data_Signer_B);

		MyInstance.deleteNode(Data_Verify_A);
		MyInstance.deleteNode(Data_Verify_B);
	});
});