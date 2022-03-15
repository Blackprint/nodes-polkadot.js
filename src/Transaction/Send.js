/**
 * import { Context, Transaction, Signer } from "../_init.js";
 * import { NodeToast } from "../utils/NodeToast.js";
 */

Blackprint.registerNode("Polkadot.js/Transaction/Send",
class TransferSendNode extends Blackprint.Node {
	// Input port
	static input = {
		Submit: Blackprint.Port.Trigger(function(){
			this.submit();
		}),
		Signer: Signer, // Can be from extension or generated keypair (with mnemonic/seed)
		Txn: Transaction,
	};

	// Output port
	static output = { Status: Object };

	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use default interface
		iface.title = "Send Transaction";
		iface.description = "Sign and submit transaction";
		this._toast = new NodeToast(iface);

		this._onStatus = ev => {
			this.ref.Output.Status = ev;
		}

		// Manually call 'update' when any cable from input port was disconnected
		this.iface.on('cable.disconnect', Context.EventSlot, ({ port })=> {
			if(port.source === 'input') this.update();
		});
	}

	// This will be called by the engine if the input port have a new value
	update(){
		let { Input } = this.ref; // Shortcut
		let toast = this._toast;

		if(!Input.Signer) return toast.warn("Signer is required");
		if(!Input.Txn) return toast.warn("Txn is required");
		toast.clear();
	}

	// Called from input port (Blackprint.Port.Trigger)
	async submit(){
		let { Input } = this.ref; // Shortcut
		let toast = this._toast;

		if(Input.Txn.api.tx?.balances?.transfer == null)
			return toast.error("The network doesn't support this feature");

		let ref = Input.Signer;
		let txn = Input.Txn.txn;

		try{
			if(ref.isPair)
				await txn.signAndSend(ref.signer, this._onStatus);
			else await txn.signAndSend(ref.address, {signer: ref.signer}, this._onStatus);
		} catch(e) {
			if(e.message.includes("32601: Method not found"))
				toast.error("The network doesn't support this feature");
			else toast.error(e.message);

			throw e;
		}
	}
});