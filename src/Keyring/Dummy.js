/**
 * import { Context, Signer } from "../_init.js";
 * import { NodeToast } from "../utils/NodeToast.js";
 * { polkadotApi, polkadotUtilCrypto } = window
 */


/**
 * Create a wallet with a random seed
 * This can be useful for testing something
 * @blackprint node
 * @summary Randomly generated wallet
 */
Blackprint.registerNode("Polkadot.js/Keyring/Dummy",
class DummyNode extends Blackprint.Node {
	// Input port
	static input = {
		/** This must be one of ed25519, sr25519, ethereum, or ecdsa */
		KeyType: Blackprint.Port.Default(String, 'ed25519'),
	};

	// Output port
	static output = {
		/** Wallet/account address in base58 format */
		Address: String,
		/** Random seed that was being used to generate this dummy wallet */
		Seed: Uint8Array,
		/** This wallet's signer */
		Signer: Signer,
		/** This wallet's pair key */
		Pair: Object,
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use empty interface
		iface.title = "Dummy Key";
	}

	// This will be called by the engine once the node has been loaded
	imported(){ this.update() }

	// This will be called by the engine if the input port have a new value
	update(){
		let { Input, Output } = this.ref; // Shortcut

		// Generate new seed and put it to the output port
		Output.Seed = polkadotUtilCrypto.randomAsU8a(32);

		let keyring = new polkadotApi.Keyring({
			type: Input.KeyType, // default to ed25519
			ss58Format: 0, // To use different format, Polkadot.js/Convert/Address To/Address is recommended
		});

		// Create keypair from seed and put it to the output port
		let pair = Output.Pair = keyring.addFromSeed(Output.Seed);

		// Wrap the signer and put the public address to the output port
		Output.Signer = new Signer(true, Output.Address, pair);
		Output.Address = pair.address;
	}
});