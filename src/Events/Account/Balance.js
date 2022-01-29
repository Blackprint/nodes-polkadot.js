Blackprint.registerNode("Polkadot.js/Events/Account/Balance",
class AccountBalanceNode extends Blackprint.Node {
	static input = {
		API: polkadotApi.ApiPromise,
		Address: String,
	};

	static output = {
		Value: Number,
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface('BPIC/Polkadot.js/Events/Account/Balance');
		iface.title = "Account Balance Event";
		iface.description = "Listen for balance changes";
	}
});

Blackprint.registerInterface('BPIC/Polkadot.js/Events/Account/Balance',
Context.IFace.EventsAccountBalance = class AccountBalanceIFace extends Blackprint.Interface {
	constructor(node){
		super(node);

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

			iface.unsubscribe = await api.query.system.account(Input.Address, function(ev){
				console.log(ev);
				// Output.Value = ev.number.toNumber();
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