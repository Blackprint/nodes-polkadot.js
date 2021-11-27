// BPIC/LibraryName is prefix from blackprint.config.js
// This file is just reference, you can remove unnecessary property/function

// Node will be initialized first by Blackprint Engine
// This should be used for initialize port structure and set the target interface
Blackprint.registerNode('LibraryName/FeatureName/Template',
class MyTemplate extends Blackprint.Node{
	// this == node

	constructor(instance){
		super(instance);

		// Interface path
		// Let it empty if you want to use default built-in interface
		// You don't need to '.registerInterface()' if using default interface
		let iface = this.setInterface('BPIC/LibraryName/FeatureName/Template');
		iface.title = 'My Title';
		iface.description = 'My Description';

		// You can use type data like Number/String or "Blackprint.Port"
		// use "Blackprint.Port.Trigger" if it's callable port
		this.input = {
			PortName1: Blackprint.Port.Default(Number, 123)
		};

		// Output only accept 1 type data
		// use "Function" if it's callable port
		this.output = {
			PortName2: Number
		};
	}

	// Put logic as minimum as you can in .registerNode
	// You can also put these function on .registerInterface instead
	init(){
		// Called before iface.init()
	}

	update(){
		// Triggered when any output value from other node are updated
		// And this node's input connected to that output
	}

	request(){
		// Triggered when other connected node is requesting
		// output from this node that have empty output
	}

	imported(){
		// When this node was successfully imported
	}
});

// For Non-sketch interface
// - first parameter is named path must use BPIC prefix
// - second parameter is interface class, should be saved to Context.IFace if you want to access it on '.sf' files, because '.sf' is executed on different context
Blackprint.registerInterface('BPIC/LibraryName/FeatureName/Template',
Context.IFace.MyTemplate = class IMyTemplate extends Blackprint.Interface {
	// this == iface

	constructor(node){
		super(node); // 'node' object from .registerNode

		// Constructor for Interface can be executed twice when using Cloned Container
		// If you're assigning data on this contructor, you should check if it already has the data
		if(this.myData !== undefined) return;
		this.myData = 123;
		this._log = '...';

		// If the data was stored on this, they will be exported as JSON
		// (Property name with _ or $ will be ignored)
		this.data = {
			get value(){ return this._value },
			set value(val){ this._value = val },
		};

		// Creating object data with class is more recommended
		// this.data = new MyDataStructure(this);
	}

	// When importing nodes from JSON, this function will be called
	imported(data){
		// Use object assign to avoid replacing the object reference (that makes our getter/setter gone)
		Object.assign(this.data, data);
	}

	init(){
		// When Engine initializing this scope

		// ====== Port Shortcut ======
		const {
			IInput, IOutput, IProperty, // Port interface
			Input, Output, Property, // Port value
		} = this.const;

		// Port interface can be used for registering event listener
		// Port value can be used for get/set the port value
		// By the way, Property is reserved feature, don't use it

		// this.output === IOutput
		// this.input === IInput
		// this.node.output === Output
		// this.node.input === Input

		// this.output.Test => Port Interface
		// this.node.output.Test => Number value
	}

	// Create custom getter and setter
	get log(){ return this._log }
	set log(val){
		this._log = val
	}
});