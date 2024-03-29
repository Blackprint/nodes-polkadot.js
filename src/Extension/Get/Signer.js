/**
 * import { Context, Signer } from "../_init.js";
 * import { NodeToast } from "../utils/NodeToast.js";
 * { polkadotExtensionDapp } = window
 */


/**
 * Before using this node,
 * You must request for access into browser extension first with
 * Polkadot.js/Connection/Extension
 * @blackprint node
 * @summary Get wallet signer from browser extension
 */
Blackprint.registerNode("Polkadot.js/Extension/Get/Signer",
class SignerNode extends Blackprint.Node {
	// Node's input/output port
	static input = {
		/** Wallet/account address in base58 format */
		Address: String,
	};
	static output = {
		/** This can be used for signing transaction */
		Signer: Signer,
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use empty interface
		iface.title = "Signer";

		this._toast = new NodeToast(this.iface);

		// Manually call 'update' when any cable from input port was disconnected
		this.iface.on('cable.disconnect', Context.EventSlot, ({ port })=> {
			if(port.source === 'input') this.update();
		});
	}

	// This will be called by the engine if the input port have a new value
	async update(){
		let { Input, Output } = this.ref; // Shortcut
		let toast = this._toast;

		if(!Input.Address)
			return toast.warn("Address is required");

		// Wait for permission
		if(Context._extensionEnabled !== true){
			toast.warn("No access to browser extension");
			await Context._extensionEnabled;
		}

		// Clear any toast if exist
		toast.clear();

		// Get the Web3 signer object
		try{
			var obj = await polkadotExtensionDapp.web3FromAddress(Input.Address);
		} catch(e) {
			return toast.warn(e.message);
		}

		// Wrap it as Signer type and set it as output
		Output.Signer = new Signer(false, Input.Address, obj.signer);
	}
});