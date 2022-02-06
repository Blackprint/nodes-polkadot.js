/**
 * import { Context } from "../_init.js";
 * { polkadotUtil } = window
 */


// Register Blackprint Node
Blackprint.registerNode("Polkadot.js/Convert/String To/Uint8Array",
class RandomSeedNode extends Blackprint.Node {
	static output = {Out: Uint8Array};
	static input = {In: String};

	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "String to Uint8Array";
	}

	// Event listener can be registered after init
	init(){
		// Clear the output port when the input cable was disconnected
		this.iface.input.In.on('disconnect', Context.EventSlot, ()=> {
			this.output.Out = null;
		});
	}

	// This will be called by the engine if the input port have a new value
	update(){
		let { Input, Output } = this.ref; // Shortcut
		Output.Out = polkadotUtil.stringToU8a(Input.In);
	}
});