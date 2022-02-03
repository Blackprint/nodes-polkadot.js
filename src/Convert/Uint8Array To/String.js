/**
 * import { Context } from "../_init.js";
 * { polkadotUtil } = window
 */


// Register Blackprint Node
Blackprint.registerNode("Polkadot.js/Convert/Uint8Array To/String",
class RandomSeedNode extends Blackprint.Node {
	static output = {Out: String};
	static input = {In: Uint8Array};

	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "Uint8Array to String";

		// Clear the output port when the input cable was disconnected
		iface.input.In.on('disconnect', Context.EventSlot, ()=> {
			this.output.Out = null;
		});
	}

	// This will be called by the engine if the input port have a new value
	update(){
		let { Input, Output } = this.ref; // Shortcut
		Output.Out = polkadotUtil.u8aToString(Input.In);
	}
});