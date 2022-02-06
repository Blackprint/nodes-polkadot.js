/**
 * import { Context } from "../_init.js";
 * import { NodeToast } from "../utils/NodeToast.js";
 * { polkadotUtilCrypto } = window
 */


// Register Blackprint Node
Blackprint.registerNode("Polkadot.js/Convert/Mnemonic",
class MnemonicNode extends Blackprint.Node {
	// Node's output/input port
	static input = { Text: String };
	static output = { Seed: Uint8Array };

	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "Mnemonic";

		this._toast = new NodeToast(iface);
	}

	// Event listener can be registered after init
	init(){
		// Clear the output port when the input cable was disconnected
		this.iface.input.Text.on('disconnect', Context.EventSlot, ()=> {
			this.output.Seed = null;
		});
	}

	// This will be called by the engine if the input port have a new value
	update(){
		let { Input, Output } = this.ref; // Shortcut
		let { mnemonicToMiniSecret, mnemonicValidate } = polkadotUtilCrypto;
		let toast = this._toast;

		try{
			if(!mnemonicValidate(Input.Text))
				return toast.warn("Invalid mnemonic");

			// Convert to seed that can be imported to Keyring and put it to the output port
			Output.Seed = mnemonicToMiniSecret(Input.Text);
			toast.clear();
		} catch(e) {
			return toast.warn(e.message);
		}
	}
});