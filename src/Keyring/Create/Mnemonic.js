/**
 * { polkadotUtilCrypto } = window
 */


/**
 * Create a random mnemonic that can be used for key pair or generating a wallet
 * @blackprint node
 * @summary Generate random mnemonic
 */
Blackprint.registerNode("Polkadot.js/Keyring/Create/Mnemonic",
class RandomSeedNode extends Blackprint.Node {
	// Input port
	// static input = { Length: Blackprint.Port.Default(Number, 12) };

	// Output port
	static output = {
		/** Random mnemonic */
		Text: String,
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use empty interface
		iface.title = "Create Mnemonic";
	}

	// This will be called by the engine once the node has been loaded
	imported(){
		// this.update();
		this.output.Text = polkadotUtilCrypto.mnemonicGenerate(12);
	}
});