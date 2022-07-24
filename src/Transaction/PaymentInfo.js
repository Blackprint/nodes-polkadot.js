/**
 * import { Context, Transaction, Signer } from "../_init.js";
 * import { NodeToast } from "../utils/NodeToast.js";
 */

/**
 * Retrieve a payment info from an signed/unsigned transaction
 * @blackprint node
 * @summary Get transaction fee
 */
Blackprint.registerNode("Polkadot.js/Transaction/PaymentInfo",
class PaymentInfoNode extends Blackprint.Node {
	// Input port
	static input = {
		/** Sender's address */
		Sender: String,
		/** Signed/unsigned transaction */
		Txn: Transaction,
	};

	// Output port
	static output = {
		/** Raw status response */
		Info: Object // ToDo
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use default interface
		iface.title = "Payment Info";
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

		if(!Input.Sender) return toast.warn("Sender address is required");
		if(!Input.Txn) return toast.warn("Txn is required");
		toast.clear();

		if(Input.Txn.api.rpc?.payment?.queryInfo == null)
			return this._toast.error("The network doesn't support this feature");

		let info;
		try{
			info = await Input.Txn.txn.paymentInfo(Input.Sender);
		} catch(e) {
			if(e.message.includes("32601: Method not found"))
				toast.error("The network doesn't support this feature");
			else toast.error(e.message);

			throw e;
		}

		Output.Info = info;
	}
});