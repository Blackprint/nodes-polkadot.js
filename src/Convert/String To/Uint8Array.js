Blackprint.registerNode("Polkadot.js/Convert/String To/Uint8Array",
class RandomSeedNode extends Blackprint.Node {
	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "String to Uint8Array";

		this.output = {Out: Uint8Array};
		this.input = {In: String};
	}

	imported(){
		let {Input, Output, IInput, IOutput} = this.const; // Shortcut
		IInput.In.on('value', Context.EventSlot, function(){
			Output.Out = polkadotUtil.stringToU8a(Input.In);
		});
	}
});