/**
 * import { Context } from "../_init.js";
 * import { NodeToast } from "../utils/NodeToast.js";
 * { polkadotExtensionDapp, polkadotApi } = window
 */

let _extensionEnabled;
let extensionEnabled = new Promise(resolve=> _extensionEnabled = resolve);


// For storing node data
class ConnectionExtensionData {
	constructor(iface){this._iface = iface}

	_dAppName = 'BP-Polkadot.js';
	get dAppName(){return this._dAppName}
	set dAppName(val){
		this._dAppName = val;

		// Already throttled before being synced to remote
		this._iface.node.syncOut('dAppName', val);
	}
}


// Register Blackprint Node
Blackprint.registerNode("Polkadot.js/Connection/Extension",
class ExtensionNode extends Blackprint.Node {
	static input = undefined; // This node doesn't need any input port

	// Output port
	static output = {
		Accounts: Array,
		IsAllowed: Boolean,
	};

	constructor(instance){
		super(instance);

		// Use custom interface
		// Engine: scroll down this file to "Blackprint.registerInterface"
		// Browser: ./Extension.sf
		let iface = this.setInterface('BPIC/Polkadot.js/Connection/Extension');
		iface.title = "Browser Wallet";
		iface.description = "Connect to extension";
	}

	// This will be called by the engine once the node has been loaded, but no cable connected
	imported(data){
		if(!data) return;
		Object.assign(this.iface.data, data);
	}

	// Add support for remote control/collaborative editor mode
	syncIn(type, data){
		if(type === 'dAppName')
			this.iface.data.dAppName = data;
	}
});


// Register Blackprint Interface (like an API for developer, or UI for sketch editor)
Blackprint.registerInterface('BPIC/Polkadot.js/Connection/Extension',
Context.IFace.ConnectionExtension = class ExtensionIFace extends Blackprint.Interface {
	constructor(node){
		super(node);
		this.data = new ConnectionExtensionData(this);

		this._toast = new NodeToast(this);
		this._toast.warn("Disconnected");
	}

	// This will be called by the engine after node has been loaded
	// and other data like cable connection has been connected/added
	async init(){
		let {Input, Output, IInput, IOutput} = this.ref; // Shortcut
		let toast = this._toast;

		let polkadot = window.injectedWeb3?.["polkadot-js"];
		if(polkadot === void 0){
			console.error("Extension injection was not found");
			return toast.error("Extension injection was not found");
		}

		toast.clear();
		toast.warn("Asking for Permission");

		try{
			this._polkadot = await polkadotExtensionDapp.web3Enable(this.data.dAppName);
		} catch(e) {
			console.error(e.message);
			toast.error(e.message);
			Output.IsAllowed = false;
			return;
		}

		if(this._polkadot.length === 0){
			Output.IsAllowed = false;
			toast.clear();
			toast.warn("Access Rejected");
			return;
		}

		toast.clear();
		toast.success("Access Granted");

		_extensionEnabled();
		extensionEnabled = true;

		this._unsubscribe = await polkadotExtensionDapp.web3AccountsSubscribe(accounts => {
			Output.Accounts = accounts;
		});

		Output.Accounts = await polkadotExtensionDapp.web3Accounts();
		Output.IsAllowed = true;
	}

	// This will be called by the engine when this node is deleted
	destroy(){
		// Unsubscribe to event listener if exist
		try{
			this._unsubscribe?.();
		} catch(e) {
			console.error(e);
		}
	}
});