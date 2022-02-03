/**
 * import { NodeToast, Context, Signer } from "../_init.js";
 * { polkadotApi } = window
 */


// Register Blackprint Node
Blackprint.registerNode("Polkadot.js/Keyring/Dummy",
class DummyNode extends Blackprint.Node {
	// Input port
	static input = {
		KeyType: Blackprint.Port.Default(String, 'sr25519'),
	};

	// Output port
	static output = {
		Address: String, // base58
		Seed: Uint8Array,
		Signer: Signer,
		Pair: Object,
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use empty interface
		iface.title = "Dummy Key";
		iface.description = "Randomly generated wallet";
	}

	// This will be called by the engine once the node has been loaded
	imported(){ this.update() }

	// This will be called by the engine if the input port have a new value
	update(){
		let { Input, Output } = this.ref; // Shortcut

		// ToDo: change to internal polkadot seed generator
		// Generate new seed and put it to the output port
		Output.Seed = crypto.getRandomValues(new Uint8Array(32));

		let keyring = new polkadotApi.Keyring({
			type: Input.KeyType, // default to sr25519
			ss58Format: 0, // To use different format, Polkadot.js/Keyring/PublicKey is recommended
		});

		// Create keypair from seed and put it to the output port
		let pair = Output.Pair = keyring.addFromSeed(Output.Seed);

		// Wrap the signer and put the public address to the output port
		Output.Signer = new Signer(true, Output.Address, pair);
		Output.Address = pair.address;
	}
});