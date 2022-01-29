Blackprint.registerNode("Polkadot.js/Convert/String To/Uint8Array",
class RandomSeedNode extends Blackprint.Node {
	static output = {Out: Uint8Array};
	static input = {In: String};

	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "String to Uint8Array";
	}

	imported(){
		let {Input, Output, IInput, IOutput} = this.ref; // Shortcut
		IInput.In.on('value', Context.EventSlot, function(){
			Output.Out = polkadotUtil.stringToU8a(Input.In);
		});
	}
});