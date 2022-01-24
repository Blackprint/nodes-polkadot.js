Blackprint.registerNode("Polkadot.js/Events/Blocks",
class BlocksNode extends Blackprint.Node {
	constructor(instance){
		super(instance);

		let iface = this.setInterface('BPIC/Polkadot.js/Events/Blocks');
		iface.title = "Blocks Event";
		iface.description = "Listen for new blocks";

		let node = this;
		this.input = {
			API: polkadotApi.ApiPromise,
		};

		this.output = {
			New: Function,
			Number: Number,
		};
	}
});

Blackprint.registerInterface('BPIC/Polkadot.js/Events/Blocks',
Context.IFace.EventsBlocks = class BlocksIFace extends Blackprint.Interface {
	constructor(node){
		super(node);

		this.number = 0;
		this.unsubscribe = false;
	}

	imported(){
		let {Input, Output, IInput, IOutput} = this.ref; // Shortcut
		let iface = this;
		let toast = new NodeToast(this);

		IInput.API.on('value', Context.EventSlot, async function(){
			if(iface.unsubscribe) iface.unsubscribe();

			let api = Input.API;
			if(!api) return;

			iface.unsubscribe = await api.rpc.chain.subscribeNewHeads(function(header){
				Output.Number = iface.number = header.number.toNumber();
				Output.New(header);
			});
		})
		.on('disconnect', Context.EventSlot, function(){
			if(iface.unsubscribe) iface.unsubscribe();
		});
	}

	destroy(){
		if(this.unsubscribe) this.unsubscribe();
	}
});