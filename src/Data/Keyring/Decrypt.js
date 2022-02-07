/**
 * import { Context } from "../_init.js";
 * import { NodeToast } from "../utils/NodeToast.js";
 * { polkadotUtil, polkadotKeyring } = window
 */

// This will be used for DecryptNode and EncryptNode
class CrypterNode extends Blackprint.Node {
	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use empty interface

		this._toast = new NodeToast(this.iface);

		// Manually call 'update' when any cable from input port was disconnected
		iface.on('cable.disconnect', Context.EventSlot, ({ port })=> {
			if(port.source === 'input') this.update();
		});
	}

	_fail(msg){
		this.output.Bytes = null; // Clear the output data if something was fail/error
		this._toast.warn(msg);
	}

	// This will be called by the engine if the input port have a new value
	update(){
		let { Input, Output } = this.ref; // Shortcut
		let toast = this._toast;

		if(!Input.Keypair)
			return this._fail("Keypair is required");

		if(!Input.Data)
			return this._fail("Data is required");

		// Remove any node toast
		toast.clear();

		// If the Data is an string, let's convert it to Uint8Array
		let data = Input.Data;
		if(data.constructor === String)
			data = polkadotUtil.stringToU8a(data);

		return {keypair: Input.Keypair, data};
	}
}


// Register Blackprint Node
Blackprint.registerNode("Polkadot.js/Data/Keyring/Decrypt",
class DecryptNode extends CrypterNode {
	// Input port
	static input = {
		Keypair: Object,
		Author: Blackprint.Port.Union([String, Uint8Array]), // base58, hex, public key's bytes
		Data: Blackprint.Port.Union([String, Uint8Array]), // text, bytes
	};

	// Output port
	static output = {
		Bytes: Uint8Array
	};

	constructor(instance){
		super(instance);
		this.iface.title = "Decrypt Data";
	}

	// This will be called by the engine if the input port have a new value
	update(){
		let { Input, Output } = this.ref; // Shortcut

		if(!Input.Author)
			return this._fail("Author address is required");

		let temp = super.update();
		if(!temp) return;

		let { keypair, data } = temp;
		let author = Input.Author;

		try {
			// Convert address to Uint8Array
			if(author.constructor === String)
				author = polkadotKeyring.decodeAddress(author);

			// Decrypt the data
			var decrypted = keypair.decryptMessage(data, author);
		} catch(e) {
			this.output.Bytes = null; // Clear the output data
			this._toast.error(e.message);
			throw e;
		}

		if(!decrypted){
			this.output.Bytes = null; // Clear the output data
			this._toast.error("Unable to decrypt data");
			return;
		}

		// Put it on output port
		Output.Bytes = decrypted;
	}
});