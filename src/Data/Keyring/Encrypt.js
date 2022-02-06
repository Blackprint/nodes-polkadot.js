/**
 * import { Context } from "../_init.js";
 * import { NodeToast } from "../utils/NodeToast.js";
 * import { CrypterNode } from "./Decrypt.js";
 * { polkadotUtil, polkadotKeyring } = window
 */


// Register Blackprint Node
Blackprint.registerNode("Polkadot.js/Data/Keyring/Encrypt",
class EncryptNode extends CrypterNode {
	// Input port
	static input = {
		Keypair: Object,
		Target: Blackprint.Port.Union([String, Uint8Array]), // base58, hex, public key's bytes
		Data: Blackprint.Port.Union([String, Uint8Array]), // text, bytes
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
		let target = Input.Target;

		try {
			// Convert address to Uint8Array
			if(target.constructor === String)
				target = polkadotKeyring.decodeAddress(target);

			// Encrypt the data
			var encrypt = keypair.encryptMessage(data, target);
		} catch(e) {
			this.output.Bytes = null; // Clear the output data
			this._toast.error(e.message);
			console.error(e);
			return;
		}

		// Put it on output port
		Output.Bytes = encrypt;
	}
});