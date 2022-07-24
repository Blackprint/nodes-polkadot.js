/**
 * import { Context } from "../_init.js";
 * { polkadotUtil } = window
 */


/**
 * Convert bytes into string
 * @blackprint node
 */
Blackprint.registerNode("Polkadot.js/Convert/Uint8Array To/String",
class RandomSeedNode extends Blackprint.Node {
	static input = {In: Uint8Array};
	static output = {Out: String};

	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "Uint8Array to String";
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
		Output.Out = polkadotUtil.u8aToString(Input.In);
	}
});