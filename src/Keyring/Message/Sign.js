// Structure only
Blackprint.registerNode("Polkadot.js/Keyring/Message/Sign",
class SignNode extends Blackprint.Node {
	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use empty interface
		iface.title = "Sign";
		iface.description = "Data signer";

		this.input = {
			Signer: Signer,
			Data: Blackprint.Port.Union([String, Uint8Array]),
		};

		this.output = {
			Bytes: Uint8Array
		};
	}

	imported(){
		let {Input, Output, IInput, IOutput} = this.ref; // Shortcut
		let toast = new NodeToast(this.iface);

		function fail(msg){
			Output.Bytes = null; // Clear it on failing
			toast.warn(msg);
		}

		async function onChanged(){
			if(Input.Signer == null)
				return fail("Signer is required");

			let msg = Input.Data;
			if(msg == null)
				return fail("Data is required");

			let signer = Input.Signer;
			toast.clear();

			if(signer.isPair){ // Signer from keypair
				if(msg.constructor === String)
					msg = polkadotUtil.stringToU8a(msg);

				Output.Bytes = signer.signer.sign(Input.Data);
			}
			else { // Signer from extension
				if(msg.constructor === Uint8Array)
					msg = polkadotUtil.u8aToHex(msg);
				else if(msg.slice(0, 2) !== '0x')
					msg = polkadotUtil.stringToHex(msg);

				try{
					var data = await signer.signer.signRaw({
						type: 'bytes',
						data: msg,
						address: signer.address,
					});
				} catch(e) {
					return fail(e.message);
				}

				toast.clear();
				Output.Bytes = polkadotUtil.hexToU8a(data.signature);
			}
		}

		this.iface.on('port.value', Context.EventSlot, onChanged);
		this.iface.on('cable.disconnect', Context.EventSlot, function({ port }){
			if(port.source === 'input') onChanged();
		});
	}
});