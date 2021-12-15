Blackprint.registerNode("Polkadot.js/Account/Transfer",
class TransferNode extends Blackprint.Node {
	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use empty interface
		iface.title = "Transfer";
		iface.description = "Transfer balance to an address";

		this.input = {
			API: polkadotApi.ApiPromise,
			Address: String, // base58
			Value: String, // in pico unit, 1e12 (pico) = 1 Dot
		};
		this.output = {
			Txn: Transaction,
		};
	}

	imported(){
		let {Input, Output, IInput, IOutput} = this.const; // Shortcut
		let toast = new NodeToast(this.iface);

		function onChanged(){
			if(Input.Address === '')
				return toast.warn("Address is required");

			if(Input.Value === '')
				return toast.warn("Value is required");

			if(Input.API === null)
				return toast.warn("API is required");

			let txn = Input.API.tx.balances.transfer(Input.Address, +Input.Value);
			Output.Txn = new Transaction(txn);
		}

		this.iface.on('port.value', Context.EventSlot, onChanged);
		this.iface.on('cable.disconnect', Context.EventSlot, function({ port }){
			if(port.source === 'input') onChanged();
		});
	}
});