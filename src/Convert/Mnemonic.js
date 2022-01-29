Blackprint.registerNode("Polkadot.js/Convert/Mnemonic",
class MnemonicNode extends Blackprint.Node {
	static input = {
		Text: String,
	};
	static output = {
		Seed: Uint8Array,
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "Mnemonic";
	}

	imported(){
		let {Input, Output, IInput, IOutput} = this.ref; // Shortcut
		let toast = new NodeToast(this.iface);

		let { mnemonicToMiniSecret, mnemonicValidate } = polkadotUtilCrypto;

		function onChanged(){
			try{
				if(!mnemonicValidate(Input.Text))
					return toast.warn("Invalid mnemonic");

				Output.Seed = mnemonicToMiniSecret(Input.Text);
				toast.clear();
			} catch(e) {
				return toast.warn(e.message);
			}
		}

		IInput.Text.on('value', Context.EventSlot, onChanged);
	}
});