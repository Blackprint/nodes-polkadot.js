/**
 * import { Context, Transaction, Signer } from "../_init.js";
 * import { NodeToast } from "../utils/NodeToast.js";
 */

/**
 * Combine transactions into one transaction to be executed in batch
 * @blackprint node
 * @summary Combine multiple transaction
 */
Blackprint.registerNode("Polkadot.js/Transaction/Batch",
class BatchNode extends Blackprint.Node {
	// Input port
	static input = {
		/** Multiple unsigned transactions */
		Txn: Blackprint.Port.ArrayOf(Transaction),
	};

	// Output port
	static output = {
		/** One unsigned transaction */
		Txn: Transaction,
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use default interface
		iface.title = "Batch Transaction";
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

		if(Input.Txn.length === 0) return toast.warn("Txn is required");
		toast.clear();

		let api = Input.Txn[0].api;
		if(api.tx.utility?.batchAll == null)
			return this._toast.error("The network doesn't support this feature");

		// batchAll: The whole transaction will rollback and fail if any of the calls was failed.
		let txn = api.tx.utility.batchAll(Input.Txn.map(val => val.txn));

		Output.Txn = new Transaction(txn, api, true);
	}
});