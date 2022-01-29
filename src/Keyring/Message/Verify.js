// Structure only
Blackprint.registerNode("Polkadot.js/Keyring/Message/Verify",
class VerifyNode extends Blackprint.Node {
	static input = {
		Address: String, // base58
		Signature: Blackprint.Port.Union([String, Uint8Array]),
		Data: Blackprint.Port.Union([String, Uint8Array]),
	};

	static output = {
		IsValid: Boolean
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use empty interface
		iface.title = "Verify";
		iface.description = "Verify signed messxage";
	}

	imported(){
		let {Input, Output, IInput, IOutput} = this.ref; // Shortcut
		let toast = new NodeToast(this.iface);

		async function onChanged(){
			if(Input.Data == null || Input.Address == '' || Input.Signature == null){
				Output.Bytes = null; // Clear it on error
				return toast.warn("Waiting required data");
			}

			let address = polkadotUtilCrypto.decodeAddress(Input.Address); // public key

			let msg = Input.Data;
			if(msg.constructor === String){
				if(msg.slice(0, 2) === '0x')
					msg = polkadotUtil.hexToU8a(msg);
				else msg = polkadotUtil.stringToU8a(msg);
			}

			let sign = Input.Signature;
			if(sign.constructor === String){
				if(sign.slice(0, 2) === '0x')
					sign = polkadotUtil.hexToU8a(sign);
				else return toast.warn("Signature must be Hex or Uint8Array");
			}

			toast.clear();
			await polkadotUtilCrypto.cryptoWaitReady();

			let hexPublicKey = polkadotUtil.u8aToHex(address);
			Output.IsValid = polkadotUtilCrypto.signatureVerify(msg, sign, hexPublicKey).isValid;
		}

		this.iface.on('port.value', Context.EventSlot, onChanged);
		this.iface.on('cable.disconnect', Context.EventSlot, function({ port }){
			if(port.source === 'input') onChanged();
		});
	}
});