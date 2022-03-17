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
		Txn: Blackprint.Port.ArrayOf(Transaction), // Support multi/batch transaction
		Nonce: Number, // Optional, in case if user want to override the nonce
	};

	// Output port
	static output = {
		Success: Function,  // Callback when the transaction was finalized and success
		Failed: Function,   // Callback when the transaction was finalized and failed
		Status: Object,     // Raw status from Polkadot.js
		TxHash: Uint8Array, // This will have value after Ready status (before Broadcast)
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
			let { Input, Output } = this.ref;
			if(ev.status.type === "Finalized"){
				toast.clear();
				toast.success(ev.status.type);

				// Display error on finalized transaction for browser UI only
				if(Blackprint.Environment.isBrowser){
					// This will only exist if the events contains "ExtrinsicFailed" event
					let error = ev.dispatchError;

					// Check error for batch transactions
					if(error == null && Input.Txn.length === 1) {
						let api = Input.Txn[0].api;

						// Search for "BatchInterrupted" event
						for(let i=0, n=ev.events.length; i < n; i++){
							if(api.events.utility.BatchInterrupted.is(ev.events[i].event)){
								error = ev.events[i].event.data[1];
								break;
							}
						}
					}

					// Skip if no error
					if(error != null) {
						if(error.isModule){
							let api = Input.Txn[0].api;
	
							let decoded = api.registry.findMetaError(error.asModule);
							let { docs, method, section } = decoded;
	
							toast.error(docs.join(' ') || `${section}: ${method}`);
						}
						else {
							console.log("Txn error data:", error.toString());
							toast.error("Transaction failed");
						}
					}
				}

				if(ev.dispatchError != null)
					Output.Failed();
				else Output.Success();
			}
			else toast.warn(ev.status.type);

			if(Output.TxHash == null && ev.txHash != null)
				Output.TxHash = ev.txHash;

			// Store the raw response to the output port
			Output.Status = ev;
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
		if(Input.Txn.length === 0) return toast.warn("Txn is required");
		toast.clear();
	}

	// Called from "Submit" input port (Blackprint.Port.Trigger)
	async submit(){
		let { Input, Output } = this.ref; // Shortcut
		let toast = this._toast;

		if(Input.Txn.length === 0 || !Input.Signer)
			return toast.error("Some input port need to have a value");

		// Get API reference (polkadotApi)
		let api = Input.Txn[0].api;
		let ref = Input.Signer;

		try{
			toast.warn("Sending request");
			Output.TxHash = null; // Remove old hash value if exist in the port

			let txn; // For preparing the query

			// If the transaction is more than 1 then use batch utility
			if(Input.Txn.length === 1)
				txn = Input.Txn[0].txn;
			else {
				// batchAll: The whole transaction will rollback and fail if any of the calls failed.
				txn = api.tx.utility.batchAll(Input.Txn.map(val => val.txn));
			}

			let options = {};

			// Override the nonce if user has inputted a value
			if(!!Input.Nonce && Input.Nonce !== 0)
				options.nonce = Input.Nonce;

			if(!ref.isPair){  // Using browser's extension
				options.signer = ref.signer;
				await txn.signAndSend(ref.address, options, this._onStatus);
			}
			else await txn.signAndSend(ref.signer, options, this._onStatus);

		} catch(e) {
			toast.clear();

			if(e.message.includes("32601: Method not found"))
				toast.error("The network doesn't support this feature");
			else toast.error(e.message);

			throw e;
		}
	}
});