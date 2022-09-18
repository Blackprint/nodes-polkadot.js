/**
 * import { Context } from "../_init.js";
 * import { NodeToast } from "../utils/NodeToast.js";
 * { polkadotApi } = window
 */


/**
 * Create a keyring to store keypairs
 * @blackprint node
 * @summary Collection of keypairs
 */
Blackprint.registerNode("Polkadot.js/Keyring/Create/Keyring",
class KeyringNode extends Blackprint.Node {
	// Input port
	static input = {
		/** This must be one of ed25519, sr25519, ethereum, or ecdsa */
		KeyType: Blackprint.Port.Default(String, 'ed25519'),
	};

	// Output port
	static output = {
		/** Polkadot.js's Keyring object */
		Keyring: polkadotApi.Keyring,
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use empty interface
		iface.title = "Keyring";

		this._toast = new NodeToast(this.iface);
	}

	// This will be called by the engine once the node has been loaded
	// We will use event listener instead 'update()'
	imported(){
		let { Input, Output, IInput } = this.ref; // Shortcut

		// Create initial Keyring
		this.currentKeyType = Input.KeyType;
		Output.Keyring = new polkadotApi.Keyring({
			type: Input.KeyType, // default to ed25519
			ss58Format: 0, // To use different format, Polkadot.js/Convert/Address To/Address is recommended
		});

		// Manually call 'update' when any cable from input port was disconnected
		IInput.KeyType.on('disconnect', Context.EventSlot, () => this.update());
	}

	// This will be called by the engine if the input port have a new value
	update(){
		let { Input, Output } = this.ref; // Shortcut
		let keyType = Input.KeyType.toLowerCase();
		let toast = this._toast;

		// Update only if keytype was changed (ed25519 <~> sr25519)
		if(this.currentKeyType === keyType)
			return toast.clear();

		if(keyType !== 'ed25519'
			&& keyType !== 'sr25519'
			&& keyType !== 'ethereum'
			&& keyType !== 'ecdsa'){
			return toast.warn("Invalid KeyType, it must be ed25519, sr25519, ethereum, or ecdsa");
		}

		// Recreate Keyring
		Output.Keyring = new polkadotApi.Keyring({
			type: keyType, // default to ed25519
			ss58Format: 0, // To use different format, Polkadot.js/Convert/Address To/Address is recommended
		});

		this.currentKeyType = keyType;
		toast.clear();
	}
});