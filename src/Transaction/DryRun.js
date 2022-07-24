/**
 * import { Context, Transaction, Signer } from "../_init.js";
 * import { NodeToast } from "../utils/NodeToast.js";
 */

/**
 * Try run a transaction, but this will not actually being executed
 * Some parachain may not support this feature
 * @blackprint node
 * @summary Try a transaction but not actually execute it
 */
Blackprint.registerNode("Polkadot.js/Transaction/DryRun",
class TransferNode extends Blackprint.Node {
	// Input port
	static input = {
		/** Can be from extension or generated keypair (with mnemonic/seed) */
		Signer: Signer,
		/** Unsigned transaction */
		Txn: Transaction,
	};

	// Output port
	static output = { Status: Object };

	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use default interface
		iface.title = "Dry Run Transaction";
		this._toast = new NodeToast(iface);

		// Manually call 'update' when any cable from input port was disconnected
		this.iface.on('cable.disconnect', Context.EventSlot, ({ port })=> {
			if(port.source === 'input') this.update();
		});
	}

	// This will be called by the engine if the input port have a new value
	async update(){
		let { Input, Output } = this.ref; // Shortcut
		let toast = this._toast;

		if(!Input.Signer) return toast.warn("Signer is required");
		if(!Input.Txn) return toast.warn("Txn is required");
		toast.clear();

		// This usually will not available when the RPC is not exposed from the node config
		if(Input.Txn.api.rpc?.system?.dryRun == null)
			return this._toast.error("The network doesn't support this feature");

		let ref = Input.Signer;
		let txn = Input.Txn.txn;

		let info;
		try{
			if(ref.isPair)
				info = await txn.dryRun(ref.signer);
			else info = await txn.dryRun(ref.address, {signer: ref.signer});
		} catch(e) {
			if(e.message.includes("32601: Method not found"))
				toast.error("The network doesn't support this feature");
			else toast.error(e.message);

			throw e;
		}

		Output.Status = info;
	}
});