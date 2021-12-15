Blackprint.registerNode("Polkadot.js/Convert/Mnemonic",
class MnemonicNode extends Blackprint.Node {
	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "Mnemonic";

		this.input = {
			Text: String,
		};
		this.output = {
			Seed: Uint8Array,
		};
	}

	imported(){
		let {Input, Output, IInput, IOutput} = this.const; // Shortcut
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