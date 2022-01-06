Blackprint.registerNode("Polkadot.js/Extension/Signer",
class EmptyNode extends Blackprint.Node {
	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use empty interface
		iface.title = "Signer";
		iface.description = "Sign data with browser extension";

		this.output = {
			Signer: Signer,
		};
		this.input = {
			Address: String,
		};
	}

	imported(){
		let {Input, Output, IInput, IOutput} = this.const; // Shortcut
		let toast = new NodeToast(this.iface);

		let node = this;
		IInput.Address.on('value', async function(ev){
			if(Input.Address === '')
				return toast.warn("Address is required");

			try{
				var obj = await polkadotExtensionDapp.web3FromAddress(Input.Address);
			} catch(e) {
				return toast.warn(e.message);
			}

			node.output.Signer = new Signer(false, Input.Address, obj.signer);
		});
	}
});