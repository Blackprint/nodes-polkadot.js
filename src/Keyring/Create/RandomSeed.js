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

	// ToDo: change to internal polkadot seed generator
	imported(){
		this.output.Seed = crypto.getRandomValues(new Uint8Array(32));
	}
});