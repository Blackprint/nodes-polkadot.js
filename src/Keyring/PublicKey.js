Blackprint.registerNode("Polkadot.js/Keyring/PublicKey",
class PublicKeyNode extends Blackprint.Node {
	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use empty interface
		iface.title = "Public Key";

		this.output = {
			Address: String,
			Bytes: Uint8Array,
		};
		this.input = {
			Keyring: polkadotApi.Keyring,
			ChainId: Number,
			Source: Blackprint.Port.Union([String, Uint8Array]),
		};
	}

	imported(){
		let {Input, Output, IInput, IOutput} = this.ref; // Shortcut
		let toast = new NodeToast(this.iface);

		function onChanged(){
			if(Input.Keyring == null || Input.Source == null){
				Output.Address = ''; // Clear it on error
				Output.Bytes = null; // Clear it on error
				return toast.warn("Waiting required data");
			}

			let ref = Input.Keyring._bp_map.get(Input.Source);
			if(ref === void 0){
				Output.Address = ''; // Clear it on error
				Output.Bytes = null; // Clear it on error
				return toast.warn("Keyring doesn't store pair for the data reference");
			}

			toast.clear();
			Output.Bytes = ref.publicKey;

			if(Input.ChainId === 0)
				Output.Address = ref.address;
			else Output.Address = Input.Keyring.encodeAddress(ref.publicKey, Input.ChainId);
		}

		this.iface.on('port.value', Context.EventSlot, onChanged);
		this.iface.on('cable.disconnect', Context.EventSlot, function({ port }){
			if(port.source === 'input') onChanged();
		});
	}
});