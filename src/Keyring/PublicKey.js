/**
 * import { Context } from "../_init.js";
 * import { NodeToast } from "../utils/NodeToast.js";
 * { polkadotApi } = window
 */


// Register Blackprint Node
Blackprint.registerNode("Polkadot.js/Keyring/PublicKey",
class PublicKeyNode extends Blackprint.Node {
	// Output port
	static output = {
		Address: String,
		Bytes: Uint8Array,
	};

	// Input port
	static input = {
		Keyring: polkadotApi.Keyring,
		Source: Blackprint.Port.Union([String, Uint8Array]),
		ChainId: Blackprint.Port.Default(Number, 0),
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use empty interface
		iface.title = "Public Key";

		this._toast = new NodeToast(this.iface);

		// Manually call 'update' when any cable from input port was disconnected
		this.iface.on('cable.disconnect', Context.EventSlot, ({ port })=> {
			if(port.source === 'input') this.update();
		});
	}

	// Clear the output data when fail/error
	_fail(msg){
		this.output.Address = null;
		this.output.Bytes = null;
		this._toast.warn(msg);
	}

	// This will be called by the engine if the input port have a new value
	update(){
		let { Input, Output } = this.ref; // Shortcut
		let toast = this._toast;

		if(!Input.Keyring)
			return this._fail("Keyring is required");

		if(!Input.Source)
			return this._fail("Source is required, this can be seed/mnemonic");

		// Get the keypair from the map
		let ref = Input.Keyring._bp_map.get(Input.Source);
		if(ref === void 0)
			return this._fail("Keyring doesn't store pair for the data reference");

		toast.clear();

		// Put the public key to the output port
		Output.Bytes = ref.publicKey;

		// Put the address to the output port, encode it if not using the default chainId
		if(Input.ChainId === 0)
			Output.Address = ref.address;
		else Output.Address = Input.Keyring.encodeAddress(ref.publicKey, Input.ChainId);
	}
});