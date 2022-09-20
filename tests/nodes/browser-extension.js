// This test is only for browser

/**
 * import { MyInstance } from '../browser.test.js';
 */

describe("Nodes for Polkadot.js's browser extension", () => {
	test("Create node for asking for permission to connect with the extension", (done) => {
		// Make sure the injectedWeb3 for accessing the extension is exist on the window
		expect(window.injectedWeb3).toBeDefined();
		expect(polkadotExtensionDapp.isWeb3Injected).toBe(true);
		
		// Create node for accessing the extension
		let connExtension = MyInstance.createNode('Polkadot.js/Connection/Extension', {data: {dAppName: 'BP-Polkadot.js'}});

		// Connect to browser wallet that aren't exist
		let extensionId = new Blackprint.OutputPort(String);
		extensionId.value = 'dummy-not-found';

		// Connect to browser wallet with id: dummy-test
		connExtension.input.ExtensionId.connectPort(extensionId);
		connExtension.ref.Input.Connect();
		expect(connExtension.ref.Output.IsAllowed).not.toBe(true);

		// Change to polkadot
		connExtension.input.ExtensionId.disconnectAll();
		extensionId.value = 'polkadot-js';

		// Connect to browser wallet with id: polkadot-js
		connExtension.input.ExtensionId.connectPort(extensionId);
		connExtension.ref.Input.Connect();

		// Check if the access was allowed
		// Note: This will always be allowed when testing on Node.js
		connExtension.output.IsAllowed.on('value', ev => {
			expect(ev.port.value).toBe(true);

			// We already prepare 2 account in "../utils/inject-browser-extension.js"
			expect(connExtension.ref.Output.Accounts.length).toBe(2);

			MyInstance.deleteNode(connExtension);
			done();
		});
	});

	let portAddressB, textData, dataSigner, extSigner;
	test("Sign a data with browser extension", (done) => {
		// Prepare wallet address
		portAddressB = new Blackprint.OutputPort(String);
		portAddressB.value = process.env.WALLET_ADDRESS_B;
		
		// Prepare the data to be signed
		textData = new Blackprint.OutputPort(String);
		textData.value = "hello world";

		// Get the signer reference from the extension
		extSigner = MyInstance.createNode('Polkadot.js/Extension/Get/Signer');
		extSigner.input.Address.connectPort(portAddressB);

		// Wait until the node get Signer input from the extension
		extSigner.output.Signer.once('value', async () => {
			// Sign the data
			dataSigner = MyInstance.createNode("Polkadot.js/Data/Sign");
			dataSigner.input.Signer.connectPort(extSigner.output.Signer);
			dataSigner.input.Data.connectPort(textData);

			// Trigger the node to sign the data
			dataSigner.ref.Input.Trigger();
			await dataSigner.signing;

			// The data signer will now have the signature of the data (stored in 'Bytes' port)
			// Port 'Output.Bytes' type: Uint8Array
			expect(dataSigner.ref.Output.Bytes).not.toBe(null);

			done();
		});
	});

	test("Verify the signed data with the wallet address (public key)", () => {
		// Verify the data signature with the wallet address
		let dataVerify = MyInstance.createNode("Polkadot.js/Data/Verify");
		dataVerify.input.Address.connectPort(portAddressB);
		dataVerify.input.Data.connectPort(textData);
		dataVerify.input.Signature.connectPort(dataSigner.output.Bytes);

		expect(dataVerify.ref.Output.IsValid).toBe(true); // true == signature is valid

		MyInstance.deleteNode(extSigner);
		MyInstance.deleteNode(dataVerify);
	});

	test("Signature verification fail if the address was different", () => {
		// Prepare wallet address
		let portAddressA = new Blackprint.OutputPort(String);
		portAddressA.value = process.env.WALLET_ADDRESS_A;
		
		// Verify the data signature with the wallet address
		let dataVerify = MyInstance.createNode("Polkadot.js/Data/Verify");
		dataVerify.input.Address.connectPort(portAddressA);
		dataVerify.input.Data.connectPort(textData);
		dataVerify.input.Signature.connectPort(dataSigner.output.Bytes);

		expect(dataVerify.ref.Output.IsValid).toBe(false); // false == signature is invalid
		MyInstance.deleteNode(dataVerify);
	});

	afterAll(() => {
		MyInstance.deleteNode(dataSigner);
	});
});