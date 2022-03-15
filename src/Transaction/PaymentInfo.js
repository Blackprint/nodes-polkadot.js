/**
 * import { Context, Transaction, Signer } from "../_init.js";
 * import { NodeToast } from "../utils/NodeToast.js";
 */

Blackprint.registerNode("Polkadot.js/Transaction/PaymentInfo",
class PaymentInfoNode extends Blackprint.Node {
	// Input port
	static input = {
		Signer: Signer, // Can be from extension or generated keypair (with mnemonic/seed)
		Txn: Transaction,
	};

	// Output port
	static output = { Info: Object };

	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use default interface
		iface.title = "Payment Info";
		iface.description = "Get transaction fee";
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

		if(Input.Txn.api.rpc?.payment?.queryInfo == null)
			return this._toast.error("The network doesn't support this feature");

		let ref = Input.Signer;
		let txn = Input.Txn.txn;

		let info;
		try{
			if(ref.isPair)
				info = await txn.paymentInfo(ref.signer);
			else info = await txn.paymentInfo(ref.address, {signer: ref.signer});
		} catch(e) {
			if(e.message.includes("32601: Method not found"))
				toast.error("The network doesn't support this feature");
			else toast.error(e.message);

			throw e;
		}

		Output.Info = info;
	}
});