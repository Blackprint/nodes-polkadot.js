/**
 * import { Context } from "../_init.js";
 * import { NodeToast } from "../utils/NodeToast.js";
 * { polkadotApi } = window;
 */

// For storing node data
class ConnectionHTTPData {
	constructor(iface){this._iface = iface}

	// example:  https://rpc.polkadot.io
	_rpcURL = '';
	get rpcURL(){return this._rpcURL}
	set rpcURL(val){
		this._rpcURL = val;
		this._iface.changeRPC();

		// Already throttled before being synced to remote
		this._iface.node.syncOut('rpcURL', val);
	}
}

// Make sure the property that can be exported to JSON is visible/enumerable
Blackprint.utils.setEnumerablePrototype(ConnectionHTTPData, {
	rpcURL: true,
});

/**
 * Connect to parachain's RPC through HTTP URL
 * @blackprint node
 * @summary Web3 RPC Connection
 */
Blackprint.registerNode("Polkadot.js/Connection/HTTP",
class HTTPNode extends Blackprint.Node {
	// Input port
	static input = {
		/** Initiate reconnection with the RPC */
		Reconnect: Blackprint.Port.Trigger(function(){
			this.iface.changeRPC();
		}),
	};

	// Output port
	static output = {
		/** RPC Provider object from Polkadot.js's */
		Provider: polkadotApi.HttpProvider,
		/** API object from Polkadot.js's */
		API: polkadotApi.ApiPromise,
		/** This will be called when we successfully connected to the RPC*/
		Connected: Function,
		/** This will be called when we disconnected with the RPC*/
		Disconnected: Function,
	};

	constructor(instance){
		super(instance);

		// Use custom interface
		// Engine: scroll down this file to "Blackprint.registerInterface"
		// Browser: ./HTTP.sf
		let iface = this.setInterface('BPIC/Polkadot.js/Connection/HTTP');
		iface.title = "HTTP";

		// Create new object for storing data
		iface.data = new ConnectionHTTPData(iface);
	}

	// This will be called by the engine once the node has been loaded
	imported(data){
		if(!data) return;

		// This will also trigger "iface.changeRPC"
		// due to getter/setter on "ConnectionHTTPData"
		Object.assign(this.iface.data, data);
	}

	// Add support for remote control/collaborative editor mode
	syncIn(type, data){
		if(type === 'rpcURL')
			this.iface.data.rpcURL = data;
	}

	// This will be called by the engine when this node is deleted
	destroy(){
		let http = this.ref.Output.Provider;
		if(http === void 0) return;

		// Disconnect from the network
		http.disconnect();
		this.ref.Output.Disconnected();
	}
});


// Register Blackprint Interface (like an API for developer, or UI for sketch editor)
Blackprint.registerInterface('BPIC/Polkadot.js/Connection/HTTP',
Context.IFace.ConnectionHTTP = class HTTPIFace extends Blackprint.Interface {
	constructor(node){
		super(node);

		this._toast = new NodeToast(this);
		this._toast.warn("Disconnected");
	}

	async changeRPC(){
		let { Input, Output } = this.ref; // Shortcut
		this._toast.clear();

		// This can be filled from sketch's UI, or with code by accessing the IFace
		let rpcURL = this.data.rpcURL;
		if(!rpcURL)
			return this._toast.error("RPC URL was empty");

		if(!/^(https|http):\/\//.test(rpcURL))
			return this._toast.error("The endpoint should start with http:// or https://");

		// If already connected to other network, let's disconnect it first
		if(Output.Provider != null){
			Output.Provider.disconnect();
			Output.Disconnected();
		}

		// Connect to the new RPC URL
		let provider = Output.Provider = new polkadotApi.HttpProvider(rpcURL);

		this._toast.warn("Connecting...");

		// Wait until connected, or show warning when failed
		try {
			var api = await polkadotApi.ApiPromise.create({ provider, throwOnConnect: true });
		} catch(e) {
			this._toast.warn("Connection failed");
			Output.API = null;
			Output.Disconnected();
			return;
		}

		// Put the API object into the output port
		Output.API = api;

		// Check connection status
		if(provider.isConnected){
			this._toast.clear();
			this._toast.success("Connected");

			Output.Connected();
		}
		else{
			this._toast.error("Failed to connect");
			Output.Disconnected();
		}
	}
});