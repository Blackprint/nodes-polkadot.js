/**
 * import { Context, Transaction } from "../_init.js";
 * import { NodeToast } from "../utils/NodeToast.js";
 * { polkadotApi } = window;
 */

Blackprint.registerNode("Polkadot.js/Account/Transfer/Balance",
class TransferNode extends Blackprint.Node {
	// Input port
	static input = {
		API: polkadotApi.ApiPromise,
		Address: String, // base58
		Value: Number, // must be positive and lower than 2^53 - 1
	};

	// Output port
	static output = {
		Txn: Transaction, // Unsigned transaction
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use default interface
		iface.title = "Transfer Balance";
		iface.description = "Transfer balance to an address";
		this._toast = new NodeToast(iface);

		// Manually call 'update' when any cable from input port was disconnected
		this.iface.on('cable.disconnect', Context.EventSlot, ({ port })=> {
			if(port.source === 'input') this.update();
		});
	}

	// This will be called by the engine if the input port have a new value
	update(){
		let { Input, Output } = this.ref; // Shortcut
		let toast = this._toast;

		if(!Input.API) return toast.warn("API is required");
		if(!Input.Address) return toast.warn("Address is required");

		// Allow transfer for 0 value
		if(Input.Value == null) return toast.warn("Value is required");

		let value = Input.Value;

		if(value < 0)
			return toast.warn("Value must be positive integer");

		if(!Number.isInteger(value))
			return toast.warn("Value must be integer, but found floating number: "+value);

		if(value > Number.MAX_SAFE_INTEGER)
			return toast.warn("Value must be lower than 2^53 - 1");

		toast.clear();

		let txn = Input.API.tx.balances.transfer(Input.Address, value);
		Output.Txn = new Transaction(txn, Input.API);
	}
});