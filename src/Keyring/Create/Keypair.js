/**
 * import { Context, Signer } from "../_init.js";
 * import { NodeToast } from "../utils/NodeToast.js";
 * { polkadotApi, polkadotUtilCrypto } = window
 */


/**
 * Create a keypair and the signer from seed or mnemonic
 * @blackprint node
 */
Blackprint.registerNode("Polkadot.js/Keyring/Create/Keypair",
class KeypairNode extends Blackprint.Node {
	// Node's input/output port
	static input = {
		/**
		 * Keypair to store the keyring
		 * You can leave this unconnected to use internal keyring
		 */
		Keyring: Blackprint.Port.Default(polkadotApi.Keyring, Context._internalKeyring),
		/** Hex string, or 32 bytes Uint8Array */
		Seed: Blackprint.Port.Union([String, Uint8Array]), 
		/** 12 or 24 words */
		Mnemonic: String, 
	};
	static output = {
		/** Generated key pair */
		Keypair: Object,
		/** Wallet/account address in base58 format */
		Address: String,
		/** This can be used for signing transaction */
		Signer: Signer,
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use empty interface
		iface.title = "Create Keypair";
		iface.description = "Using internal keyring";

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

		if(Input.Keyring === Context._internalKeyring)
			this.iface.description = "Using internal keyring: "+Input.Keyring.type;
		else this.iface.description = "Using connected keyring: "+Input.Keyring.type;

		// Obtain last keyring and save the new keyring to this node object
		let oldKeyring = this._keyring;
		this._keyring = Input.Keyring;

		// If the input port was changed, remove keypair from the old keyring
		if(Output.Keypair != null){
			oldKeyring.removePair(Output.Keypair.address);
			Output.Keypair = null;
		}

		let { Keyring, Seed, Mnemonic } = Input;

		// We only need one seed/mnemonic, let's disconnect the other connection
		if(Mnemonic && !!Seed){
			// this.update() will be called again after the cable was disconnected

			if(this._mnemonic === false && IInput.Seed.cables.length !== 0)
				return IInput.Seed.disconnectAll();

			IInput.Mnemonic.disconnectAll();
			return;
		}

		if(Mnemonic) {
			if(!polkadotUtilCrypto.mnemonicValidate(Mnemonic))
				return toast.warn("Invalid mnemonic, it must be 12 or 24 words");

			Output.Keypair = Keyring.addFromMnemonic(Mnemonic);
			this._mnemonic = true;
		}
		else if(Seed != null) {
			// The seed must be 32 bytes
			if(Seed.byteLength !== 32)
				return toast.warn("Seed must be 32 bytes");

			Output.Keypair = Keyring.addFromSeed(Seed);
			this._mnemonic = false;
		}
		else {
			Output.Keypair = null;
			Output.Address = null;
			Output.Signer = null;
			// Output.PublicKey = null;
			this._mnemonic = false;
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