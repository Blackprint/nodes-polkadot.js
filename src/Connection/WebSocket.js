/**
 * import { Context } from "../_init.js";
 * import { NodeToast } from "../utils/NodeToast.js";
 * { polkadotApi } = window;
 */

// For storing node data
class ConnectionWebSocketData {
	constructor(iface){this._iface = iface}

	// example:  wss://rpc.polkadot.io
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
Blackprint.utils.setEnumerablePrototype(ConnectionWebSocketData, {
	rpcURL: true,
});

/**
 * Connect to parachain's RPC through WebSocket
 * @blackprint node
 * @summary Web3 RPC Connection
 */
Blackprint.registerNode("Polkadot.js/Connection/WebSocket",
class WebSocketNode extends Blackprint.Node {
	// Input port
	static input = {
		/** Initiate connection with the RPC */
		Connect: Blackprint.Port.Trigger(function({ iface }){
			iface.node.output.Provider?.connect();
		}),
		/** Disconnect the RPC */
		Disconnect: Blackprint.Port.Trigger(function({ iface }){
			iface.node.output.Provider?.disconnect();
		}),
	};

	// Output port
	static output = {
		/** RPC Provider object from Polkadot.js's */
		Provider: polkadotApi.WsProvider,
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
		// Browser: ./WebSocket.sf
		let iface = this.setInterface('BPIC/Polkadot.js/Connection/WebSocket');
		iface.title = "WebSocket";

		iface.data = new ConnectionWebSocketData(iface);
	}

	// This will be called by the engine once the node has been loaded
	imported(data){
		if(!data) return;
		Object.assign(this.iface.data, data);
	}

	// Add support for remote control/collaborative editor mode
	syncIn(type, data){
		if(type === 'rpcURL')
			this.iface.data.rpcURL = data;
	}

	// This will be called by the engine when this node is deleted
	destroy(){
		let ws = this.ref.Output.Provider;
		if(ws === void 0) return;

		// Disconnect from the network
		ws.disconnect();
	}
});


// Register Blackprint Interface (like an API for developer, or UI for sketch editor)
Blackprint.registerInterface('BPIC/Polkadot.js/Connection/WebSocket',
Context.IFace.ConnectionWebSocket = class WebSocketIFace extends Blackprint.Interface {
	constructor(node){
		super(node);

		this._toast = new NodeToast(this);
		this._toast.warn("Disconnected");
	}

	async changeRPC(){
		let { Output } = this.ref; // Shortcut
		this._toast.clear();

		// If already connected to other network, let's disconnect it first
		Output.Provider?.disconnect();

		// This can be filled from sketch's UI, or with code by accessing the IFace
		let rpcURL = this.data.rpcURL;
		if(!rpcURL)
			return this._toast.error("RPC URL was empty");

		if(!/^(wss|ws):\/\//.test(rpcURL))
			return this._toast.error("The endpoint should start with ws:// or wss://");

		// Connect to the new RPC URL and put the Provider object to the output port
		let provider = Output.Provider = new polkadotApi.WsProvider(rpcURL);

		clearTimeout(this._prepareAPIWait);

		// Add event listener before connecting to the network
		let initialized = false;
		provider.on('connected', ()=> {
			this._toast.clear();
			this._toast.success("Connected");

			if(!initialized){
				this._toast.warn("Preparing API...");

				// Show error if no response from RPC
				this._prepareAPIWait = setTimeout(() => {
					if(initialized) return;

					this._toast.clear();
					this._toast.error("No response from RPC");
				}, 60e3);
			}

			Output.Connected();
		});

		provider.on('disconnected', ()=> {
			this._toast.warn("Disconnected");
			Output.Disconnected();
		});

		// Wait until connected and put the API object into the output port
		this._toast.warn("Connecting...");
		Output.API = await polkadotApi.ApiPromise.create({ provider });

		initialized = true;
		clearTimeout(this._prepareAPIWait);

		if(this._toast.haveWarn.text === "Preparing API...")
			this._toast.clear();
	}
});