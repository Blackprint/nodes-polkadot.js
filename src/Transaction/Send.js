/**
 * import { Context, Transaction, Signer } from "../_init.js";
 * import { NodeToast } from "../utils/NodeToast.js";
 */

/**
 * Create an unsigned transaction
 * You may need to sign and send this to the RPC to be executed
 * @blackprint node
 * @summary Sign and submit transaction
 */
Blackprint.registerNode("Polkadot.js/Transaction/Send",
class TransferSendNode extends Blackprint.Node {
	// Input port
	static input = {
		/** Submit the transaction request into the parachain */
		Submit: Blackprint.Port.Trigger(function({ iface }){
			iface.node.submit();
		}),
		/** Can be from extension or generated keypair (with mnemonic/seed) */
		Signer: Signer,
		/** Unsigned transaction that will be submitted */
		Txn: Transaction,
		/** Optional, in case if user want to override the nonce */
		Nonce: Number,
	};

	// Output port
	static output = {
		/** Callback when the transaction was finalized and success */
		Success: Function,
		/** Callback when the transaction was finalized and failed */
		Failed: Function,
		/** Raw status from Polkadot.js */
		Status: Object,
		/** This will have value after Ready status (before Broadcast) */
		TxHash: Uint8Array
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use default interface
		iface.title = "Send Transaction";
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
						let api = Input.Txn.api;

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
							let api = Input.Txn.api;
	
							try{
								let decoded = api.registry.findMetaError(error.asModule);
								let { docs, method, section } = decoded;
		
								toast.error(docs.join(' ') || `${section}: ${method}`);
							}
							catch{
								console.log("Txn error data:", error.toString());
								toast.error("Transaction failed");
							}
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
		if(!Input.Txn) return toast.warn("Txn is required");
		toast.clear();
	}

	// Called from "Submit" input port (Blackprint.Port.Trigger)
	async submit(){
		let { Input, Output } = this.ref; // Shortcut
		let toast = this._toast;

		if(!Input.Txn || !Input.Signer)
			return toast.error("Some input port need to have a value");

		toast.clear();
		let ref = Input.Signer;

		Output.TxHash = null; // Remove old hash value if exist in the port
		Output.Status = null;

		let txn = Input.Txn.txn; // Obtain transaction reference
		let options = {};

		// Override the nonce if user has inputted a value
		if(!!Input.Nonce && Input.Nonce !== 0)
			options.nonce = Input.Nonce;

		toast.warn("Sending request");

		try{
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

			Output.Failed();
		}
	}
});