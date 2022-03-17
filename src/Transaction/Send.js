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
	static output = {
		Status: Object,    // Raw status from Polkadot.js
		Success: Function, // Callback when the transaction was finalized and success
		Failed: Function,  // Callback when the transaction was finalized and failed
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use default interface
		iface.title = "Send Transaction";
		iface.description = "Sign and submit transaction";
		let toast = this._toast = new NodeToast(iface);

		// After you submit the transaction
		// This function will be called when this node received response from the network
		this._onStatus = ev => {
			if(ev.status.type === "Finalized"){
				toast.clear();
				toast.success(ev.status.type);

				// Display error on finalized transaction for browser UI only
				if(ev.dispatchError != null && Blackprint.Environment.isBrowser){
					let error = ev.dispatchError;

					if(error.isModule){
						let api = this.ref.Input.Txn.api;

						let decoded = api.registry.findMetaError(error.asModule);
						let { docs, method, section } = decoded;

						toast.error(docs.join(' ') || `${section}: ${method}`);
					}
					else {
						console.log("Txn error data:", error.toString());
						toast.error("Transaction failed");
					}
				}

				if(ev.dispatchError != null)
					this.ref.Output.Failed();
				else this.ref.Output.Success();
			}
			else toast.warn(ev.status.type);

			// Store the raw response to the output port
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
			toast.warn("Sending request");

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