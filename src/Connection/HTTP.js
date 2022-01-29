Blackprint.registerNode("Polkadot.js/Connection/HTTP",
class HTTPNode extends Blackprint.Node {
	static input = {
		Connect: Blackprint.Port.Trigger(function(){
			this.output.Provider.connect();
		}),
		Disconnect: Blackprint.Port.Trigger(function(){
			this.output.Provider.disconnect();
		}),
	};

	static output = {
		Provider: polkadotApi.HttpProvider,
		API: polkadotApi.ApiPromise,
		Connected: Function,
		Disconnected: Function,
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface('BPIC/Polkadot.js/Connection/HTTP');
		iface.title = "HTTP";
		iface.description = "Web3 RPC Connection";
	}

	imported(data){
		if(!data) return;
		Object.assign(this.iface.data, data);
	}
});

Blackprint.registerInterface('BPIC/Polkadot.js/Connection/HTTP',
Context.IFace.ConnectionHTTP = class HTTPIFace extends Blackprint.Interface {
	constructor(node){
		super(node);

		this._toast = new NodeToast(this);
		this._toast.warn("Disconnected");

		this.data = new ConnectionHTTPData(this);
	}

	async changeRPC(){
		let {Input, Output, IInput, IOutput} = this.ref; // Shortcut

		if(!this.data.rpcURL)
			return this._toast.error("RPC URL was empty");

		Output.Provider?.disconnect(); // wss://rpc.polkadot.io

		let provider = Output.Provider = new polkadotApi.HttpProvider(this.data.rpcURL);
		this._toast.clear();
		this._toast.warn("Connecting...");
		Output.API = await polkadotApi.ApiPromise.create({ provider });

		if(provider.isConnected){
			this._toast.clear();
			this._toast.success("Connected");
		}
	}

	destroy(){
		let ws = this.ref.Output.Provider;
		if(ws === void 0) return;

		ws.disconnect();
	}
});

class ConnectionHTTPData {
	constructor(iface){this._iface = iface}

	_rpcURL = '';
	get rpcURL(){return this._rpcURL}
	set rpcURL(val){
		this._rpcURL = val;
		this._iface.changeRPC();
	}
}