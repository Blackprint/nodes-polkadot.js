/**
 * import { NodeToast, Context } from "../_init.js";
 * { polkadotApi, polkadotUtilCrypto } = window
 */


// Register Blackprint Node
Blackprint.registerNode("Polkadot.js/Keyring/Create/Keyring",
class KeyringNode extends Blackprint.Node {
	// Output port
	static output = {
		Keyring: polkadotApi.Keyring
	};

	// Input port
	static input = {
		KeyType: Blackprint.Port.Default(String, 'sr25519'),
		Seed: Blackprint.Port.ArrayOf(Uint8Array),
		Mnemonic: Blackprint.Port.ArrayOf(String),
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use empty interface
		iface.title = "Keyring";
		iface.description = "Collection of keys";
	}

	// This will be called by the engine if the input port have a new value
	// We will use event listener instead 'update()'
	imported(){
		let { Input, Output } = this.ref; // Shortcut

		// Create initial Keyring
		let currentKeyType = Input.KeyType;
		let keyring = this.keyring = Output.Keyring = new polkadotApi.Keyring({
			type: Input.KeyType, // default to sr25519
			ss58Format: 0, // To use different format, Polkadot.js/Keyring/PublicKey is recommended
		});

		// Store the keypair and the source mapping
		let map = new Map();
		Object.defineProperty(keyring, '_bp_map', {value: map});

		function removePair(ev){
			let temp = map.get(ev.target.value);
			if(temp === void 0)
				throw new Error("Data reference was missing to remove it from keyring");

			map.delete(ev.target.value);
			keyring.removePair(temp.address);
		}


		// Event listener when Seed input port has new value or disconnected
		IInput.Seed
			.on('value', Context.EventSlot, function(ev){
				let value = ev.cable.value;

				// It must be 32 bytes
				if(value.byteLength !== 32)
					return toast.warn("Seed must be 32 bytes");

				toast.clear();
				map.set(value, keyring.addFromSeed(value));
			})
			.on('disconnect', Context.EventSlot, removePair);


		// Event listener when Mnemonic input port has new value or disconnected
		IInput.Mnemonic
			.on('value', Context.EventSlot, function(ev){
				let value = ev.cable.value;

				if(!polkadotUtilCrypto.mnemonicValidate(value))
					return toast.warn("Invalid mnemonic");

				toast.clear();
				map.set(value, keyring.addFromMnemonic(value));
			})
			.on('disconnect', Context.EventSlot, removePair);


		// If keytype was changed (sr25519 <~> ed25519)
		const recreateKeyring = (ev)=> {
			if(currentKeyType === Input.KeyType) return;
			currentKeyType = Input.KeyType;

			// Recreate Keyring
			keyring = this.keyring = Output.Keyring = new polkadotApi.Keyring({
				type: Input.KeyType, // default to sr25519
				ss58Format: 0, // To use different format, Polkadot.js/Keyring/PublicKey is recommended
			});

			// Reimport all seed/mnemonic to the new keyring, and remap it
			for(let [source, keypair] of map){
				if(source.constructor === String){
					map.set(source, keyring.addFromMnemonic(source));
				}
				else{
					map.set(source, keyring.addFromSeed(source));
				}
			}
		};

		// Event listener when KeyType input port has new value or disconnected
		IInput.KeyType
			.on('value', Context.EventSlot, recreateKeyring)
			.on('disconnect', Context.EventSlot, recreateKeyring);
	}
});