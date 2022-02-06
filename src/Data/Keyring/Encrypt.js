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
		Keypair: Object,
		Target: String, // base58
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

		if(!Input.Target)
			return this._fail("Target address is required");

		let temp = super.update();

		if(!temp) return;
		let { keypair, data } = temp;

		// Encrypt the data and put it on output port
		Output.Bytes = keypair.encryptMessage(data, Input.Target);
	}
});