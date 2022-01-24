Blackprint.registerNode("Polkadot.js/Transaction/Send",
class TransferNode extends Blackprint.Node {
	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use empty interface
		iface.title = "Send Transaction";

		let node = this;
		this.input = {
			Submit: Blackprint.Port.Trigger(function(){
				node.submit(true);
			}),
			Provider: Blackprint.Port.Union([polkadotApi.WsProvider, polkadotApi.HttpProvider]),
			Signer: Signer,
			Txn: Transaction,
		};

		this.output = {
			Status: Object
		};
	}

	imported(){
		let {Input, Output, IInput, IOutput} = this.ref; // Shortcut
		let toast = new NodeToast(this.iface);

		function onStatus(ev){
			Output.Status = ev;
		}

		let onChanged = this.submit = async function(isSubmit){
			if(Input.Provider === null) return toast.warn("Provider is required");
			if(Input.Signer === null) return toast.warn("Signer is required");
			if(Input.Txn === null) return toast.warn("Txn is required");
			toast.clear();

			if(isSubmit !== true) return;

			let ref = Input.Signer;
			let txn = Input.Txn.txn;

			try{
				if(ref.isPair)
					await txn.signAndSend(ref.signer, onStatus);
				else await txn.signAndSend(ref.address, {signer: ref.signer}, onStatus);
			} catch(e) {
				toast.error(e.message);
				throw e;
			}
		}

		this.iface.on('port.value', Context.EventSlot, onChanged);
		this.iface.on('cable.disconnect', Context.EventSlot, function({ port }){
			if(port.source === 'input') onChanged();
		});
	}
});