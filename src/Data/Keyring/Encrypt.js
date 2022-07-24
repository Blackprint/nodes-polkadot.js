/**
 * import { Context } from "../_init.js";
 * import { NodeToast } from "../utils/NodeToast.js";
 * import { CrypterNode } from "./Decrypt.js";
 * { polkadotUtil, polkadotKeyring } = window
 */


/**
 * Encrypt a data by using wallet's keypair
 * @blackprint node
 */
Blackprint.registerNode("Polkadot.js/Data/Keyring/Encrypt",
class EncryptNode extends CrypterNode {
	// Input port
	static input = {
		/** Wallet's keypair for encrypting data */
		Keypair: Object,
		/**
		 * Target's wallet address who will decrypt the data
		 * can be base58, hex string, public key's bytes
		 */
		Target: Blackprint.Port.Union([String, Uint8Array]),
		/** Raw data in text or bytes (Uint8Array) */
		Data: Blackprint.Port.Union([String, Uint8Array]),
	};

	// Output port
	static output = {
		/** Encrypted data in bytes */
		Bytes: Uint8Array,
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
			throw e;
		}

		// Put it on output port
		Output.Bytes = encrypt;
	}
});