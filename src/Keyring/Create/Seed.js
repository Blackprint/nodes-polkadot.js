/**
 * import { Context } from "../_init.js";
 * import { NodeToast } from "../utils/NodeToast.js";
 * { polkadotUtil } = window
 */


/**
 * Create a random seed that can be used for key pair or generating a wallet
 * @blackprint node
 * @summary Generate random seed
 */
Blackprint.registerNode("Polkadot.js/Keyring/Create/Seed",
class RandomSeedNode extends Blackprint.Node {
	// Output port
	static output = {
		/** Random seed */
		Seed: Uint8Array,
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use empty interface
		iface.title = "Random Seed";
	}

	// This will be called by the engine once the node has been loaded
	imported(){
		this.output.Seed = polkadotUtilCrypto.randomAsU8a(32);
	}
});