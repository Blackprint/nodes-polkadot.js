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
	set dAppName(val){this._dAppName = val}
}


// Register Blackprint Node
Blackprint.registerNode("Polkadot.js/Connection/Extension",
class ExtensionNode extends Blackprint.Node {
	static input = undefined; // This node doesn't need any input port
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
});


// Register Blackprint Interface (like an API for developer, or UI for sketch editor)
Blackprint.registerInterface('BPIC/Polkadot.js/Connection/Extension',
Context.IFace.ConnectionExtension = class ExtensionIFace extends Blackprint.Interface {
	constructor(node){
		super(node);

		this._toast = new NodeToast(this);
		this._toast.warn("Disconnected");

		this.data = new ConnectionExtensionData(this);
	}

	// This will be called by the engine after node has been loaded
	// and other data like cable connection has been connected/added
	async init(){
		let {Input, Output, IInput, IOutput} = this.ref; // Shortcut

		let polkadot = window.injectedWeb3?.["polkadot-js"];
		if(polkadot === void 0)
			return this._toast.error("Extension injection was not found");

		this._toast.clear();
		this._toast.warn("Asking for Permission");

		try{
			this._polkadot = await polkadotExtensionDapp.web3Enable(this.data.dAppName);
		} catch(e) {
			Output.IsAllowed = false;
			this._toast.clear();
			this._toast.warn("Access Rejected");
			return;
		}

		this._toast.clear();
		this._toast.success("Access Granted");
		Output.IsAllowed = true;

		_extensionEnabled();
		extensionEnabled = true;

		this.node.output.Accounts = await polkadotExtensionDapp.web3Accounts();

		let node = this;
		this._unsubscribe = await polkadotExtensionDapp.web3AccountsSubscribe(accounts => {
			this.node.output.Accounts = accounts;
		});
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

	// ToDo: Implement this if in the future the wallet has an RPC
	async _connect(){
		let {Input, Output, IInput, IOutput} = this.ref; // Shortcut
		let polkadot = this._polkadot;

		// let provider = Output.Socket = new ExtensionProvider(polkadot.provider);

		let that = this;
		that._toast.clear();
		// this._toast.warn("Connecting...");

		// provider.on('connected', function(){
		// 	that._toast.clear();
		// 	that._toast.success("Connected");
		// 	Output.Connected();
		// });

		// provider.on('disconnected', function(){
		// 	that._toast.warn("Disconnected");
		// 	Output.Disconnected();
		// });

		// Output.API = await polkadotApi.ApiPromise.create({ provider });
	}
});