/**
 * import { Context, Signer, internalKeyring } from "../_init.js";
 * import { NodeToast } from "../utils/NodeToast.js";
 * { polkadotApi } = window
 */


// Register Blackprint Node
Blackprint.registerNode("Polkadot.js/Keyring/Create/Keypair",
class KeypairNode extends Blackprint.Node {
	// Node's input/output port
	static output = {
		Keypair: Object,
		Address: String,
		// PublicKey: Uint8Array,
		Signer: Signer,
	};

	static input = {
		Keyring: Blackprint.Port.Default(polkadotApi.Keyring, internalKeyring),
		Seed: Blackprint.Port.Union([String, Uint8Array]), // hex, or 32 bytes U8A
		Mnemonic: String, // 12 or 24 words
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use empty interface
		iface.title = "Create Keypair";
		iface.description = "Using internal keyring: sr25519";

		this._toast = new NodeToast(this.iface);

		// Manually call 'update' when any cable from input port was disconnected
		this.iface.on('cable.disconnect', Context.EventSlot, ({ port })=> {
			if(port.source === 'input') this.update();
		});
	}

	// This will be called by the engine if the input port have a new value
	update(){
		let { Input, Output, IInput } = this.ref; // Shortcut
		let toast = this._toast;

		if(Input.Keyring === internalKeyring)
			this.iface.description = "Using internal keyring: "+Input.Keyring.type;
		else this.iface.description = "Using connected keyring: "+Input.Keyring.type;

		// Obtain last keyring and save the new keyring to this node object
		let oldKeyring = this._keyring;
		this._keyring = Input.Keyring;

		// If the input port was changed, remove keypair from the old keyring
		if(Output.Keypair != null){
			oldKeyring.removePair(Output.Keypair);
			Output.Keypair = null;
		}

		let { Keyring, Seed, Mnemonic } = Input;
		if(!!Mnemonic) {
			// Disconnect cable from Seed port if exist
			IInput.Seed.disconnectAll();

			if(!polkadotUtilCrypto.mnemonicValidate(Mnemonic))
				return toast.warn("Invalid mnemonic, it must be 12 or 24 words");

			Output.Keypair = Keyring.addFromMnemonic(Mnemonic);
		}
		else if(Seed == null) {
			// Disconnect cable from Mnemonic port if exist
			IInput.Mnemonic.disconnectAll();

			// It must be 32 bytes
			if(Seed.byteLength !== 32)
				return toast.warn("Seed must be 32 bytes");

			Output.Keypair = Keyring.addFromSeed(Mnemonic);
		}
		else {
			Output.Keypair = null;
			Output.Address = null;
			Output.Signer = null;
			// Output.PublicKey = null;
			return toast.warn("Seed or Mnemonic is required");
		}

		toast.clear();
		let pair = Output.Keypair;

		// Wrap the signer and put it to the output port
		Output.Signer = new Signer(true, pair.address, pair);
		Output.Address = pair.address;
		// Output.PublicKey = pair.publicKey;
	}
});