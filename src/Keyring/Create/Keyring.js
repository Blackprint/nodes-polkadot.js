Blackprint.registerNode("Polkadot.js/Keyring/Create/Keyring",
class KeyringNode extends Blackprint.Node {
	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use empty interface
		iface.title = "Keyring";
		iface.description = "Collection of keys";

		this.output = {
			Keyring: polkadotApi.Keyring
		};

		this.input = {
			ChainId: Number,
			Seed: Blackprint.Port.ArrayOf(Uint8Array),
			Mnemonic: Blackprint.Port.ArrayOf(String),
		};
	}

	imported(){
		let {Input, Output, IInput, IOutput} = this.const; // Shortcut
		let keyring = this.keyring = this.output.Keyring = new polkadotApi.Keyring({
			// type: 'ed25519',
			type: 'sr25519',
			ss58Format: 0,
		});

		let toast = new NodeToast(this.iface);
		let map = new Map();
		Object.defineProperty(keyring, '_bp_map', {value: map});

		function removePair(ev){
			let temp = map.get(ev.target.value);
			if(temp === void 0)
				throw new Error("Data reference was missing to remove it from keyring");

			map.delete(ev.target.value);
			keyring.removePair(temp.address);
		}

		IInput.Seed.on('value', Context.EventSlot, function(ev){
			let value = ev.cable.value;

			// It must be 32 bytes
			if(value.byteLength !== 32)
				return toast.warn("Seed must be 32 bytes");

			toast.clear();
			map.set(value, keyring.addFromSeed(value));
		})
		.on('disconnect', Context.EventSlot, removePair);

		IInput.Mnemonic.on('value', Context.EventSlot, function(ev){
			let value = ev.cable.value;

			if(!polkadotUtilCrypto.mnemonicValidate(value))
				return toast.warn("Invalid mnemonic");

			toast.clear();
			map.set(value, keyring.addFromMnemonic(value));
		})
		.on('disconnect', Context.EventSlot, removePair);

		IInput.ChainId.on('value', Context.EventSlot, function(ev){
			keyring.setSS58Format(Input.ChainId);
		})
		.on('disconnect', Context.EventSlot, function(){
			keyring.setSS58Format(0);
		});
	}
});