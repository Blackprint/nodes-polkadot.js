/**
 * import { Context } from "../_init.js";
 * import { NodeToast } from "../utils/NodeToast.js";
 * { polkadotApi } = window
 */

Blackprint.registerNode("Polkadot.js/Events/Account/Balance",
class AccountBalanceNode extends Blackprint.Node {
	// Node type: event listener
	static type = 'event';

	// Input port
	static input = {
		API: polkadotApi.ApiPromise,
		Address: String,
	};

	// Output port
	static output = {
		Data: Object,
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // Use default interface
		iface.title = "Account Balance Event";
		iface.description = "Listen for balance changes";
		iface.type = 'event';

		this._toast = new NodeToast(this);

		// This will be replaced if subcribing to an event, default: no operation
		this.unsubscribe = ()=> {};
	}

	// This will be called by the engine after the node has been loaded
	// and other data like cable connection has been connected/added
	init(){
		let { IInput } = this.ref; // Shortcut

		// Listen if the cable was disconnected from the input port
		IInput.API.on('disconnect', Context.EventSlot, ()=> {
			this.unsubscribe();
		});
	}

	// This will be called by the engine if the input port have a new value
	async update(){
		let { Input, Output } = this.ref; // Shortcut

		// If this node is already subscribing to blocks event, let's unsubscribe it
		this.unsubscribe();

		let api = Input.API;
		if(!api) return;

		if(!api.hasSubscriptions)
			return this._toast.error("Please use WebSocket for using this feature");

		this._toast.warn("Subscribing...");
		this.unsubscribe = await api.query.system.account(Input.Address, ev => {
			Output.Data = ev;
		});

		// Clear the toast
		this._toast.clear();
		this._toast.success("Subscribed!");
	}

	// This will be called by the engine when this node is deleted
	destroy(){
		if(this.unsubscribe) this.unsubscribe();
	}
});