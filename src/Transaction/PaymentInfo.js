Blackprint.registerNode("Polkadot.js/Transaction/PaymentInfo",
class PaymentInfoNode extends Blackprint.Node {
	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use empty interface
		iface.title = "Txn Payment Info";

		this.input = {
			Provider: Blackprint.Port.Union([polkadotApi.WsProvider, polkadotApi.HttpProvider]),
			Signer: Signer,
			Txn: Transaction,
		};

		this.output = {
			Info: Object
		};
	}

	imported(){
		let {Input, Output, IInput, IOutput} = this.ref; // Shortcut
		let toast = new NodeToast(this.iface);

		async function onChanged(){
			if(Input.Provider === null) return toast.warn("Provider is required");
			if(Input.Signer === null) return toast.warn("Signer is required");
			if(Input.Txn === null) return toast.warn("Txn is required");
			toast.clear();

			let ref = Input.Signer;
			let txn = Input.Txn.txn;

			let info;
			try{
				if(ref.isPair)
					info = await txn.paymentInfo(ref.signer);
				else info = await txn.paymentInfo(ref.address, {signer: ref.signer});
			} catch(e) {
				toast.error(e.message);
				throw e;
			}

			Output.Info = info;
		}

		this.iface.on('port.value', Context.EventSlot, onChanged);
		this.iface.on('cable.disconnect', Context.EventSlot, function({ port }){
			if(port.source === 'input') onChanged();
		});
	}
});