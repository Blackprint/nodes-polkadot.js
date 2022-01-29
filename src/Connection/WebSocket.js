Blackprint.registerNode("Polkadot.js/Connection/WebSocket",
class WebSocketNode extends Blackprint.Node {
	static input = {
		Connect: Blackprint.Port.Trigger(function(){
			this.output.Provider.connect();
		}),
		Disconnect: Blackprint.Port.Trigger(function(){
			this.output.Provider.disconnect();
		}),
	};

	static output = {
		Provider: polkadotApi.WsProvider,
		API: polkadotApi.ApiPromise,
		Connected: Function,
		Disconnected: Function,
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface('BPIC/Polkadot.js/Connection/WebSocket');
		iface.title = "WebSocket";
		iface.description = "Web3 RPC Connection";
	}

	imported(data){
		if(!data) return;
		Object.assign(this.iface.data, data);
	}
});

Blackprint.registerInterface('BPIC/Polkadot.js/Connection/WebSocket',
Context.IFace.ConnectionWebSocket = class WebSocketIFace extends Blackprint.Interface {
	constructor(node){
		super(node);

		this._toast = new NodeToast(this);
		this._toast.warn("Disconnected");

		this.data = new ConnectionWebSocketData(this);
	}

	async changeRPC(){
		let {Input, Output, IInput, IOutput} = this.ref; // Shortcut

		if(!this.data.rpcURL)
			return this._toast.error("RPC URL was empty");

		Output.Provider?.disconnect(); // wss://rpc.polkadot.io

		let provider = Output.Provider = new polkadotApi.WsProvider(this.data.rpcURL);
		let that = this;

		that._toast.clear();
		this._toast.warn("Connecting...");

		provider.on('connected', function(){
			that._toast.clear();
			that._toast.success("Connected");
			Output.Connected();
		});

		provider.on('disconnected', function(){
			that._toast.warn("Disconnected");
			Output.Disconnected();
		});

		Output.API = await polkadotApi.ApiPromise.create({ provider });
	}

	destroy(){
		let ws = this.ref.Output.Provider;
		if(ws === void 0) return;

		ws.disconnect();
	}
});

class ConnectionWebSocketData {
	constructor(iface){this._iface = iface}

	_rpcURL = '';
	get rpcURL(){return this._rpcURL}
	set rpcURL(val){
		this._rpcURL = val;
		this._iface.changeRPC();
	}
}