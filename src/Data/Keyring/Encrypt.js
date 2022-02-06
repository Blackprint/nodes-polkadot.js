/**
 * import { Context } from "../_init.js";
 * import { NodeToast } from "../utils/NodeToast.js";
 * import { CrypterNode } from "./Decrypt.js";
 * { polkadotUtil, polkadotApi } = window
 */


// Register Blackprint Node
Blackprint.registerNode("Polkadot.js/Data/Keyring/Encrypt",
class EncryptNode extends CrypterNode {
	// Input port
	static input = {
		Keyring: polkadotApi.Keyring,
		Address: String, // base58
		Data: Blackprint.Port.Union([String, Uint8Array]),
	};

	// Output port
	static output = {
		Bytes: Uint8Array
	};

	constructor(instance){
		super(instance);
		this.iface.title = "Encrypt Data";
	}

	// This will be called by the engine if the input port have a new value
	update(){
		let { Input, Output } = this.ref; // Shortcut
		let data = super.update();

		if(!data) return;
		let { keypair, message } = data;

		// Decrypt the message and put it on output port
		let nonce = window.crypto.getRandomValues(new Uint8Array(24));
		Output.Bytes = keypair.encryptMessage(message, void 0, nonce); // ToDo: try remove nonce and 'void 0'
	}
});