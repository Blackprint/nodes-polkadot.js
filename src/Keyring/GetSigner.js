/**
 * import { Context, Signer } from "../_init.js";
 * import { NodeToast } from "../utils/NodeToast.js";
 * { polkadotApi } = window
 */


// Register Blackprint Node
Blackprint.registerNode("Polkadot.js/Keyring/GetSigner",
class SignerNode extends Blackprint.Node {
	// Node's input/output port
	static output = { Signer: Signer };
	static input = {
		Address: String, // base58
		Keyring: polkadotApi.Keyring,
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use empty interface
		iface.title = "Get Signer";
		iface.description = "Get signer from keyring";

		this._toast = new NodeToast(this.iface);

		// Manually call 'update' when any cable from input port was disconnected
		this.iface.on('cable.disconnect', Context.EventSlot, ({ port })=> {
			if(port.source === 'input') this.update();
		});
	}

	update(){
		let { Input, Output } = this.ref; // Shortcut
		let { Keyring, Address } = Input.Keyring;

		if(!Keyring){
			Output.Signer = null;
			return this._toast.warn("Keyring is required");
		}

		if(!Address){
			Output.Signer = null;
			return this._toast.warn("Address is required");
		}

		let key = Keyring.getPair(Address);
		if(key === void 0){
			Output.Signer = null;
			return this._toast.warn("Address was not found on Keyring");
		}

		// Wrap the signer and put it to the output port
		Output.Signer = new Signer(true, Address, key);
	}
});