Blackprint.registerNode("Polkadot.js/Convert/Uint8Array To/String",
class RandomSeedNode extends Blackprint.Node {
	static output = {Out: String};
	static input = {In: Uint8Array};

	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "Uint8Array to String";
	}

	imported(){
		let {Input, Output, IInput, IOutput} = this.ref; // Shortcut
		IInput.In.on('value', Context.EventSlot, function(){
			Output.Out = polkadotUtil.u8aToString(Input.In);
		});
	}
});