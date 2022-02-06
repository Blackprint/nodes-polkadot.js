/**
 * import { Context } from "../_init.js";
 * { polkadotKeyring } = window
 */


// Register Blackprint Node
Blackprint.registerNode("Polkadot.js/Convert/Address To/Uint8Array",
class RandomSeedNode extends Blackprint.Node {
	static output = { Bytes: Uint8Array };
	static input = { Address: String };

	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "Address to Address";

		this._toast = new NodeToast(this.iface);
	}

	// Event listener can be registered after init
	// init(){
	// 	// Clear the output port when the input cable was disconnected
	// 	this.iface.on('cable.disconnect', Context.EventSlot, ()=> this.update());
	// }

	_fail(msg){
		this.output.Bytes = null;
		this._toast.warn(msg);
	}

	// This will be called by the engine if the input port have a new value
	update(){
		let { Input, Output } = this.ref; // Shortcut

		if(!Input.Address) return this._fail('Address is required');

		toast.clear();
		Output.Bytes = polkadotKeyring.encodeAddress(Input.Address);
	}
});