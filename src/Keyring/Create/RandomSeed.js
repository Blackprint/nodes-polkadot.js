Blackprint.registerNode("Polkadot.js/Keyring/Create/RandomSeed",
class RandomSeedNode extends Blackprint.Node {
	static output = {
		Seed: Uint8Array
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use empty interface
		iface.title = "Random Seed";
		iface.description = "Generate random seed";
	}

	imported(){
		this.output.Seed = crypto.getRandomValues(new Uint8Array(32));
	}
});