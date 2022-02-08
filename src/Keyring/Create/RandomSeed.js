/**
 * import { Context } from "../_init.js";
 * import { NodeToast } from "../utils/NodeToast.js";
 * { polkadotUtil, polkadotUtilCrypto } = window
 */


// Register Blackprint Node
Blackprint.registerNode("Polkadot.js/Keyring/Create/RandomSeed",
class RandomSeedNode extends Blackprint.Node {
	// Output port
	static output = { Seed: Uint8Array };

	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use empty interface
		iface.title = "Random Seed";
		iface.description = "Generate random seed";
	}

	// This will be called by the engine once the node has been loaded
	imported(){
		this.output.Seed = polkadotUtilCrypto.randomAsU8a(32);
	}
});