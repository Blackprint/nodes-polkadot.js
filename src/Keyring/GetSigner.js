Blackprint.registerNode("Polkadot.js/Keyring/GetSigner",
class SignerNode extends Blackprint.Node {
	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use empty interface
		iface.title = "Get Signer";
		iface.description = "Get signer from keyring";

		this.output = {
			Signer: Signer,
		};
		this.input = {
			Address: String, // base58
			Keyring: polkadotApi.Keyring,
		};
	}

	imported(){
		let {Input, Output, IInput, IOutput} = this.const; // Shortcut
		let toast = new NodeToast(this.iface);

		let node = this;
		function onChanged(ev){
			let key = Input.Keyring.getPair(Input.Address);
			if(key === void 0)
				return toast.warn("Address was not found on Keyring");

			node.output.Signer = new Signer(true, Input.Address, key);
		}

		this.iface.on('port.value', Context.EventSlot, onChanged);
	}
});