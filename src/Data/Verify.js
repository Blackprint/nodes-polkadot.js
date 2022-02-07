/**
 * import { Context } from "../_init.js";
 * import { NodeToast } from "../utils/NodeToast.js";
 * { polkadotUtil, polkadotUtilCrypto } = window
 */


// Register Blackprint Node
Blackprint.registerNode("Polkadot.js/Data/Verify",
class VerifyNode extends Blackprint.Node {
	// Input port
	static input = {
		Address: String, // base58
		Signature: Blackprint.Port.Union([String, Uint8Array]),
		Data: Blackprint.Port.Union([String, Uint8Array]),
	};

	// Output port
	static output = {
		IsValid: Boolean
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use empty interface
		iface.title = "Verify";
		iface.description = "Verify signed message";

		this._toast = new NodeToast(this.iface);

		// Manually call 'update' when any cable from input port was disconnected
		this.iface.on('cable.disconnect', Context.EventSlot, ({ port })=> {
			if(port.source === 'input') this.update();
		});
	}

	_fail(msg){
		this.output.IsValid = null; // Clear the output data if something was fail/error
		this._toast.warn(msg);
	}

	// This will be called by the engine if the input port have a new value
	async update(){
		let { Input, Output } = this.ref; // Shortcut

		if(!Input.Data)
			return this._fail("Data is required");

		if(!Input.Address)
			return this._fail("Address is required");

		if(!Input.Signature)
			return this._fail("Signature is required");

		// If the Data was string, let's convert it to Uint8Array
		let data = Input.Data;
		if(data.constructor === String){
			if(data.slice(0, 2) === '0x')
				data = polkadotUtil.hexToU8a(data);
			else data = polkadotUtil.stringToU8a(data);
		}

		// If the Signature was string, maybe it was a Hex, let's convert it to Uint8Array
		let sign = Input.Signature;
		if(sign.constructor === String){
			if(sign.slice(0, 2) === '0x')
				sign = polkadotUtil.hexToU8a(sign);
			else return this._fail("Signature must be Hex or Uint8Array");
		}

		// Remove any node toast
		this._toast.clear();
		await polkadotUtilCrypto.cryptoWaitReady();

		try{
			// Verify the message/data and the signature with the public key
			var temp = polkadotUtilCrypto.signatureVerify(data, sign, Input.Address);
		} catch(e) {
			this._fail(e.message);
			throw e;
		}

		Output.IsValid = temp.isValid;
	}
});