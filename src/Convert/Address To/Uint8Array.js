/**
 * import { Context } from "../_init.js";
 * { polkadotKeyring } = window
 */


/**
 * Convert the wallet address (in base58 format) into bytes
 * @blackprint node
 */
Blackprint.registerNode("Polkadot.js/Convert/Address To/Uint8Array",
class RandomSeedNode extends Blackprint.Node {
	static output = {
		/** Address's bytes */
		Bytes: Uint8Array,
	};
	static input = {
		/** Wallet/account address in base58 format */
		Address: String,
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "Address to Address";

		this._toast = new NodeToast(this.iface);

		// Manually call 'update' when any cable from input port was disconnected
		this.iface.on('cable.disconnect', Context.EventSlot, ({ port })=> {
			if(port.source === 'input') this.update();
		});
	}

	_fail(msg){
		this.output.Bytes = null;
		this._toast.warn(msg);
	}

	// This will be called by the engine if the input port have a new value
	update(){
		let { Input, Output } = this.ref; // Shortcut

		if(!Input.Address) return this._fail('Address is required');

		this._toast.clear();
		Output.Bytes = polkadotKeyring.decodeAddress(Input.Address);
	}
});