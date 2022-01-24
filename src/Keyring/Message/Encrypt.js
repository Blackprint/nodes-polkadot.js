// Structure only
Blackprint.registerNode("Polkadot.js/Keyring/Message/Encrypt",
class EncryptNode extends Blackprint.Node {
	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use empty interface
		iface.title = "Encrypt Data";

		this.input = {
			Keyring: polkadotApi.Keyring,
			Address: String, // base58
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
			if(Input.Keyring == null || Input.Address == '' || Input.Data == null){
				Output.Bytes = null; // Clear it on error
				return toast.warn("Waiting required data");
			}

			try{
				var key = Input.Keyring.getPair(Input.Address);
			} catch(e) {
				Output.Bytes = null; // Clear it on error
				return toast.warn(e.Data);
			}

			toast.clear();

			let msg = Input.Data;
			if(msg.constructor === String)
				msg = polkadotUtil.stringToU8a(msg);

			let nonce = crypto.getRandomValues(new Uint8Array(24));
			Output.Bytes = key.encryptMessage(msg, void 0, nonce);
		}

		this.iface.on('port.value', Context.EventSlot, onChanged);
		this.iface.on('cable.disconnect', Context.EventSlot, function({ port }){
			if(port.source === 'input') onChanged();
		});
	}
});