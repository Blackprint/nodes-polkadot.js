/**
 * import { Context } from "../_init.js";
 * import { NodeToast } from "../utils/NodeToast.js";
 * { polkadotApi } = window
 */


// Register Blackprint Node
Blackprint.registerNode("Polkadot.js/Events/Blocks",
class BlocksNode extends Blackprint.Node {
	// Node type: event listener
	static type = 'event';

	// Input port
	static input = {
		API: polkadotApi.ApiPromise,
	};

	// Output port
	static output = {
		Data: Object,
		Number: Number,
	};

	constructor(instance){
		super(instance);

		// Use custom interface
		// Engine: scroll down this file to "Blackprint.registerInterface"
		// Browser: ./Blocks.sf
		let iface = this.setInterface('BPIC/Polkadot.js/Events/Blocks');
		iface.title = "Blocks Event";
		iface.description = "Listen for new blocks";
	}
});


// Register Blackprint Interface (like an API for developer, or UI for sketch editor)
Blackprint.registerInterface('BPIC/Polkadot.js/Events/Blocks',
Context.IFace.EventsBlocks = class BlocksIFace extends Blackprint.Interface {
	constructor(node){
		super(node);

		this.number = 0; // blocks number
		this.unsubscribe = false; // callable to unsubcribe event

		this._toast = new NodeToast(this);
	}

	// This will be called by the engine after the node has been loaded
	// and other data like cable connection has been connected/added
	init(){
		let { IInput } = this.ref; // Shortcut

		// Listen if the cable was disconnected from the input port
		IInput.API.on('disconnect', Context.EventSlot, ()=> {
			if(this.unsubscribe) this.unsubscribe();
		});
	}

	// This will be called by the engine if the input port have a new value
	async update(){
		let { Input, Output } = this.ref; // Shortcut

		// If this node is already subscribing to blocks event, let's unsubscribe it
		if(this.unsubscribe) this.unsubscribe();

		let api = Input.API;
		if(!api) return;

		// Subscribe to new heads/blocks and save the 'unsubscribe' function
		this._toast.warn("Subscribing...");
		this.unsubscribe = await api.rpc.chain.subscribeNewHeads(header => {
			Output.Data = header;
			Output.Number = this.number = header.number.toNumber();
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