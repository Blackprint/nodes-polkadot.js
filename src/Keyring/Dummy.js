Blackprint.registerNode("Polkadot.js/Keyring/Dummy",
class DummyNode extends Blackprint.Node {
	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use empty interface
		iface.title = "Dummy Key";
		iface.description = "Randomly generated wallet";

		this.output = {
			Address: String, // base58
			Seed: Uint8Array,
			Signer: Signer,
			Pair: Object,
			// Keyring: polkadotApi.Keyring,
		};
	}

	imported(){
		let {Input, Output, IInput, IOutput} = this.ref; // Shortcut
		let toast = new NodeToast(this.iface);
		Output.Seed = crypto.getRandomValues(new Uint8Array(32));

		let chainId = 0;
		let keyring = new polkadotApi.Keyring({
			// type: 'ed25519',
			type: 'sr25519',
			ss58Format: chainId,
		});

		let pair = Output.Pair = keyring.addFromSeed(Output.Seed);
		Output.Address = pair.address;
		Output.Signer = new Signer(true, Output.Address, pair);
	}
});