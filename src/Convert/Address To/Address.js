/**
 * import { Context } from "../_init.js";
 * { polkadotKeyring } = window
 */


// Register Blackprint Node
Blackprint.registerNode("Polkadot.js/Convert/Address To/Address",
class RandomSeedNode extends Blackprint.Node {
	static output = {Address: String};
	static input = {
		Address: String,
		ChainId: Number,
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "Address to Address";

		this._toast = new NodeToast(this.iface);
	}

	// Event listener can be registered after init
	init(){
		// Clear the output port when the input cable was disconnected
		this.iface.on('cable.disconnect', Context.EventSlot, ()=> this.update());
	}

	_fail(msg){
		this.output.Address = null;
		this._toast.warn(msg);
	}

	// This will be called by the engine if the input port have a new value
	update(){
		let { Input, Output } = this.ref; // Shortcut

		if(!Input.Address) return this._fail('Address is required');
		if(!Input.ChainId) return this._fail('ChainId is required');

		this._toast.clear();
		Output.Address = polkadotKeyring.encodeAddress(Input.Address, Input.ChainId);
	}
});