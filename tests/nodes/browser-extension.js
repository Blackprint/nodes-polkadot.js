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
		let extension = MyInstance.createNode('Polkadot.js/Connection/Extension', {data: {dAppName: 'BP-Polkadot.js'}});
		extension.init();

		// Check if the access was allowed
		// Note: This will always be allowed when testing on Node.js
		extension.output.IsAllowed.on('value', ev => {
			expect(ev.port.value).toBe(true);

			// We already prepare 2 account in "../utils/inject-browser-extension.js"
			expect(extension.ref.Output.Accounts.length).toBe(2);
			done();
		});
	});

	test("Sign a data with extension and verify it with public key (wallet address)", (done) => {
		// Prepare wallet address
		let portAddressB = new Blackprint.OutputPort(String);
		portAddressB.value = process.env.WALLET_ADDRESS_B;
		
		// Prepare the data to be signed
		let textData = new Blackprint.OutputPort(String);
		textData.value = "hello world";

		// Get the signer reference from the extension
		let signer = MyInstance.createNode('Polkadot.js/Extension/Get/Signer');
		signer.input.Address.connectPort(portAddressB);

		// Sign the data
		let dataSigner = MyInstance.createNode("Polkadot.js/Data/Sign");
		dataSigner.input.Signer.connectPort(signer.output.Signer);
		dataSigner.input.Data.connectPort(textData);

		// Verify the data signature with the wallet address
		let dataVerify = MyInstance.createNode("Polkadot.js/Data/Verify");
		dataVerify.input.Address.connectPort(portAddressB);
		dataVerify.input.Data.connectPort(textData);
		dataVerify.input.Signature.connectPort(dataSigner.output.Bytes);

		dataVerify.output.IsValid.on('value', ev => {
			expect(ev.port.value).toBe(true); // true == signature is valid
			done();
		});
	});
});