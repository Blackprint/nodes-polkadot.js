Blackprint.registerNode("Polkadot.js/Keyring/Message/Decrypt",
class DecryptNode extends Blackprint.Node {
	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use empty interface
		iface.title = "Decrypt Data";

		this.input = {
			Keyring: polkadotApi.Keyring,
			Address: String, // base58
			// Sender: String, // base58
			Data: Blackprint.Port.Union([String, Uint8Array]),
		};

		this.output = {
			Bytes: Uint8Array
		};
	}

	imported(){
		let {Input, Output, IInput, IOutput} = this.ref; // Shortcut
		let toast = new NodeToast(this.iface);

		function onChanged(){
			if(Input.Keyring == null || Input.Address == null || Input.Data == null){
				Output.Bytes = null; // Clear it on error
				return toast.warn("Waiting required data");
			}

			try{
				var key = Input.Keyring.getPair(Input.Address);
			} catch(e) {
				Output.Bytes = null; // Clear it on error
				return toast.warn(e.message);
			}

			toast.clear();

			let msg = Input.Data;
			if(msg.constructor === String)
				msg = polkadotUtil.stringToU8a(msg);

			Output.Bytes = key.decryptMessage(msg, void 0);
		}

		this.iface.on('port.value', Context.EventSlot, onChanged);
		this.iface.on('cable.disconnect', Context.EventSlot, function({ port }){
			if(port.source === 'input') onChanged();
		});
	}
});