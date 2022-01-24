Blackprint.registerNode("Polkadot.js/Convert/Uint8Array To/String",
class RandomSeedNode extends Blackprint.Node {
	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "Uint8Array to String";

		this.output = {Out: String};
		this.input = {In: Uint8Array};
	}

	imported(){
		let {Input, Output, IInput, IOutput} = this.ref; // Shortcut
		IInput.In.on('value', Context.EventSlot, function(){
			Output.Out = polkadotUtil.u8aToString(Input.In);
		});
	}
});