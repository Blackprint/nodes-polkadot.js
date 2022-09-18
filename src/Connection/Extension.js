/**
 * import { Context } from "../_init.js";
 * import { NodeToast } from "../utils/NodeToast.js";
 * { polkadotExtensionDapp, polkadotApi } = window
 */

let _extensionEnabled;
Context._extensionEnabled = new Promise(resolve=> _extensionEnabled = resolve);


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

// Make sure the property that can be exported to JSON is visible/enumerable
Blackprint.utils.setEnumerablePrototype(ConnectionExtensionData, {
	dAppName: true,
});

/**
 * Connect a wallet from browser extension
 * @blackprint node
 * @summary Connect wallet from browser
 */
Blackprint.registerNode("Polkadot.js/Connection/Extension",
class ExtensionNode extends Blackprint.Node {
	// Input port
	static input = {
		/**
		 * Extension's id
		 * 
		 * If you're using Polkadot{.js} browser extension
		 * The id is `polkadot-js`
		 */
		ExtensionId: Blackprint.Port.Default(String, 'polkadot-js'),
		/** Request the connection */
		Connect: Blackprint.Port.Trigger(function({ iface }){
			iface.connectExtension();
		}),
	};

	// Output port
	static output = {
		/** Wallet accounts from browser extension */
		Accounts: Array,
		/** Return true if user was allowed access to browser extension */
		IsAllowed: Boolean,
	};

	constructor(instance){
		super(instance);

		// Use custom interface
		// Engine: scroll down this file to "Blackprint.registerInterface"
		// Browser: ./Extension.sf
		let iface = this.setInterface('BPIC/Polkadot.js/Connection/Extension');
		iface.title = "Browser Wallet";
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

	// This will be called if `Connect` port has been triggered
	async connectExtension(){
		let { Input, Output } = this.ref; // Shortcut
		let toast = this._toast;

		if(!Input.ExtensionId){
			console.error("ExtensionId is required");
			return toast.error("ExtensionId is required");
		}

		let wallet = window.injectedWeb3?.[Input.ExtensionId];
		if(wallet === void 0){
			console.error("Extension (with id: "+ Input.ExtensionId +") was not found");
			return toast.error("Extension (with id: "+ Input.ExtensionId +") was not found");
		}

		toast.clear();
		toast.warn("Asking for Permission");

		// Unsubscribe from the last extension if the connection was exist
		this._unsubscribe?.();

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
		Context._extensionEnabled = true;

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