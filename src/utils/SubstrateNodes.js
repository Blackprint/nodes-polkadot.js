// Work in progress
// Set this to true to enable this generator
let SubstrateMetadata = true;

// Watch/Subscribe will be an event
let SubstrateSubscriber = {
	SubmitAndWatchExtrinsic: "author",
	Subscribe: "eth",
	SubscribeAllHeads: "chain",
	SubscribeFinalizedHeads: "chain",
	SubscribeJustifications: "grandpa",
	SubscribeNewHeads: "chain",
	SubscribeRuntimeVersion: "state",
	SubscribeStorage: "state",
};

let TypeAny = Blackprint.Types.Any;

// ToDo: Type mapping (Rust Types => JavaScript Types)
// Vec => Array
// HashMap => Map
// Option => can be null or have a value (optional)
let SubstrateTypeData = {
	'AccountId': String,
	'ApplyExtrinsicResult': TypeAny,
	'BeefySignedCommitment': TypeAny,
	'BlockHash': TypeAny,
	'BlockNumber': Number,
	'Bytes': String,
	'ChainProperties': TypeAny,
	'ChainType': TypeAny,
	'ContractCallRequest': TypeAny,
	'ContractExecResult': TypeAny,
	'ContractInstantiateResult': TypeAny,
	'CreatedBlock': TypeAny,
	'EthAccount': TypeAny,
	'EthCallRequest': TypeAny,
	'EthFilter': TypeAny,
	'EthFilterChanges': TypeAny,
	'EthLog': TypeAny,
	'EthReceipt': TypeAny,
	'EthRichBlock': TypeAny,
	'EthSubKind': TypeAny,
	'EthSubParams': TypeAny,
	'EthSyncStatus': TypeAny,
	'EthTransaction': TypeAny,
	'EthTransactionRequest': TypeAny,
	'EthWork': TypeAny,
	'Extrinsic': TypeAny,
	'ExtrinsicOrHash': TypeAny,
	'ExtrinsicStatus': TypeAny,
	'FeeDetails': TypeAny,
	'H64': String,
	'H160': String,
	'H256': String,
	'Hash': String,
	'HashMap<AuthorityId,EpochAuthorship>': TypeAny, // ToDo: HashMap<A, B> => (Map[A] = B)
	'Header': TypeAny,
	'EncodedFinalityProofs': TypeAny,
	'Health': TypeAny,
	'Index': TypeAny,
	'InstantiateRequest': TypeAny,
	'Json': TypeAny,
	'Justification': TypeAny,
	'JustificationNotification': TypeAny,
	'KeyValue': Object,
	'Metadata': TypeAny,
	'MmrLeafProof': TypeAny,
	'NetworkState': TypeAny,
	'NodeRole': TypeAny,
	'Null': TypeAny,
	'PeerInfo': TypeAny,
	'PrefixedStorageKey': TypeAny,
	'ReadProof': TypeAny,
	'ReportedRoundStates': TypeAny,
	'RpcMethods': TypeAny,
	'RuntimeDispatchInfo': TypeAny,
	'RuntimeVersion': TypeAny,
	'SignedBlock': TypeAny,
	'StorageChangeSet': TypeAny,
	'StorageData': TypeAny,
	'StorageKey': TypeAny,
	'StorageKind': TypeAny,
	'String': String,
	'SyncState': TypeAny,
	'Text': String,
	'TraceBlockResponse': TypeAny,
	'U64': Number,
	'U256': Number,
	'bool': Boolean,
	'u32': Number,
	'u64': Number,
};

/**
 * For extracting function name, parameter, and return types
 * @param  String str function list to be extracted
 * @return Array
 */
function functionParser(str, options){
	// Clean the spaces and split the new line
	let list = str.trim().replace(/\t+| /g, '').split('\n');

	// For each lines
	for (var i = 0; i < list.length; i++) {
		let temp = list[i];
		let funcName, args, returnType;

		// Implementation below can be replaced with RegExp, but more complicated I think

		// For Substrate Extrinsics that doesn't return value
		if(options.isExtrinsics)
			temp += ':Null';

		// For Substrate Constants
		if(options.isConst)
			temp = temp.replace(':', '():');

		// Separate name, parameter, and types
		// ex: hasSessionKeys(sessionKeys:Bytes):bool
		([temp, returnType] = temp.split('):'));
		([funcName, args] = temp.split('('));

		if(args === void 0) console.error(`Incorrect format "${temp}", `);

		let argsName = [];
		if(!options.typeAsName){
			// Get the parameters/arguments name
			args = args.replace(/,?([a-zA-Z0-9_?]+):/g, function(full, name){
				argsName.push(name);
				return ';;'; // Remove the parameter name from the text
			})
			.replace(/^;;/m, ''); // Remove the first ';;'
		}
		else{
			try {
				argsName = args.split(',');
				args = argsName.join(';;');
			} catch(e) {
				console.error(`Incorrect format "${temp}", `, e);
			}
		}

		// Let's obtain the function parameter's type data
		let argsObj = {};
		if(args !== ''){
			args = args.split(';;');

			// For each type data on the parameters
			for (var a = 0; a < args.length; a++) {
				let name = argsName[a];

				// Capitalize first word and assign it to argsObj
				// SessionKeys => Bytes
				name = name.slice(0, 1).toUpperCase() + name.slice(1);
				args[a] = args[a].replace(/^Option<(.*?)>$/m, (full, type) => {
					name += '?';
					return type;
				});

				argsObj[name] = args[a];
			}
		}

		let optionalReturn = false;
		returnType = returnType.replace(/Option<(.*?)>$/m, (full, type) => {
			optionalReturn = true;
			return type;
		});

		// ToDo: reconsider
		returnType = returnType.replace(/(Vec|HashMap)<(.*?)>$/m, fillLooseType);
		for(let key in argsObj)
			argsObj[key] = argsObj[key].replace(/(Vec|HashMap)<(.*?)>$/m, fillLooseType);

		// Put the extraction in the 'list'
		list[i] = {
			name: funcName.slice(0, 1).toUpperCase() + funcName.slice(1),
			args: argsObj,
			returnType,
			optionalReturn,
		};
	}

	return list;
}
		
function fillLooseType(full, wrapper, type){
	if(SubstrateTypeData[type] != null) return type;

	if(wrapper === 'HashMap')
		SubstrateTypeData[type] = Object;
	// else if(wrapper === 'Vec')
	// 	SubstrateTypeData[type] = Array;

	return type;
}

/**
 * Generate Blackprint nodes for Substrate RPC
 * @param Array list [description]
 */
function Substrate_BlackprintNodeGenerator(options, list){ // eslint-disable-line
	if(SubstrateMetadata === false) return;

	let { namespace, description, apiPath, isConst, isExtrinsics } = options;

	// For each array items
	for (var i = 0; i < list.length; i++) {
		let temp = list[i];
		let funcs = functionParser(temp.funcs, options);

		// For each extracted function from the string
		that: for (var a = 0; a < funcs.length; a++) {
			let func = funcs[a];

			// Skip subscribe or watch because it was an event
			// We will create separate nodes to handle subscribe/unsubscribe
			if(/subscribe|watch/i.test(func.name) && !options.loose){
				if(SubstrateSubscriber[func.name] === void 0)
					console.error(`Substrate subscriber for "${func.name}" was not found`);

				continue;
			}

			// If you found error from this line, then the SubstrateTypeData need to be updated
			if(SubstrateTypeData[func.returnType] === void 0 && !options.loose){
				console.error(`Substrate type data for "${func.returnType}" was not found`);
				continue;
			}


			// Type mapping (Rust Types => JavaScript Types)
			let returnToField = func.returnType;
			let preprocessType = TypeAny;
			if(func.returnType !== 'Null'){
				// Simplify port name
				let portName = func.returnType
					.replace(/(Vec|HashMap)<(.*?)>$/m, function(full, wrapper, type){
						if(wrapper === 'Vec') return type;

						// ToDO: HashMap
						return type;
					});

				if(options.loose && SubstrateTypeData[func.returnType] === void 0)
					SubstrateTypeData[func.returnType] = TypeAny;

				preprocessType = SubstrateTypeData[func.returnType];

				if(preprocessType !== Number && preprocessType !== String && preprocessType !== Boolean)
					preprocessType = TypeAny;

				if(preprocessType == null)
					preprocessType = TypeAny;

				if(func.optionalReturn)
					portName += '?';

				// This will be used as output port
				// port name => type
				func.returnType = {
					[portName]: SubstrateTypeData[func.returnType]
				};

				returnToField = portName;
			}
			else func.returnType = void 0; // Didn't return data

			if(isExtrinsics)
				func.returnType = {Finished: Blackprint.Types.Trigger};

			// Type mapping (Rust Types => JavaScript Types)
			let args = func.args;
			let RPCParams = Object.keys(args);
			for(let portName in args){
				let typeData = args[portName];

				if(options.loose && SubstrateTypeData[typeData] === void 0)
					SubstrateTypeData[typeData] = TypeAny;

				// If you found error from this line, then the SubstrateTypeData need to be updated
				if(SubstrateTypeData[typeData] === void 0){
					console.error(`Substrate type data for "${typeData}" was not found`);
					continue that;
				}

				// This will be used as input port
				// port name => type
				args[portName] = SubstrateTypeData[typeData];
			}

			// Categorizing Blackprint Node's path by function name
			let funcName = func.name
			.replace(/By([A-Z].*)/, function(full, name){
				return 'By/'+name;
			})
			.replace(/^(Get|Set|Has|New)([A-Z].*)/, function(full, category, name){
				return category + '/' +name;
			});

			// Capitalize the first character
			let apiName = func.name.slice(0, 1).toLowerCase() + func.name.slice(1);

			let defaultInput = {
				API: polkadotApi.ApiPromise,
				Trigger: Blackprint.Port.Trigger(function({ iface }){
					iface.node.trigger(); // => async trigger()
				})
			};

			// For Substrate Constants
			if(isConst) delete defaultInput.Trigger;

			if(func.optionalReturn){
				let temp = {};
				for (let key in func.returnType)
					temp[key.replace('?', '')] = func.returnType[key];

				func.returnType = temp;
			}

			// Custom Node class
			class GeneratedNode extends Blackprint.Node {
				static skipSuggestTypeAny = true; // Because some of type still using many Type.Any, let's skip the suggestion
				static isGenerated = true;

				// Output port, this can be undefined if return nothing (no output port)
				static output = func.returnType;

				// Input port for each nodes
				static input = Object.assign(defaultInput, args);

				constructor(instance){
					super(instance);

					// Use default interface
					let iface = this.setInterface();
					iface.title = `${temp.name} ${func.name}`; // ex: Author HasKey
					iface.description = description;

					// For showing toast above the node
					this._toast = new NodeToast(iface);
				}

				// This will be called by the engine if the input port have a new value
				update(){
					let {Input, Output} = this.ref; // Shortcut
					this._toast.clear();

					if(Input.API != null){
						if(Input.API[apiPath][temp.rpc_path]?.[apiName] == null){
							this._toast.error("This network doesn't support this feature");
							return;
						}
					}
					else if(!isExtrinsics){
						Output[returnToField] = null;
					}

					// For Substrate Constants
					if(isConst) this.trigger();
				}

				// This will be triggered from input port (input.Trigger)
				async trigger(){
					let {Input, Output} = this.ref; // Shortcut
					let toast = this._toast;

					if(Input.API === null)
						return toast.warn("API is required");

					// Get reference, ex: rpc_path = author
					let obj = Input.API[apiPath][temp.rpc_path];

					if(obj == null) return toast.error("This network doesn't support this feature");

					// Prepare arguments before calling the Polkadot.js's RPC function
					let args = [];
					for (var i = 0; i < RPCParams.length; i++) {
						args.push(Input[RPCParams[i]]);
					}

					// Call the RPC function and put the result to the output port
					try {
						var response = isConst ? obj[apiName] : await obj[apiName].apply(obj, args);
					} catch(e) {
						Output[returnToField] = null;
						toast.error(e.message);
						return;
					}

					if(isExtrinsics){
						Output.OnFinish();
						return;
					}

					if(preprocessType !== TypeAny)
						response = preprocessType(response);
					
					if(response.value !== undefined)
						response = response.value;

					// ToDo: should we use type data's name as the port name?
					Output[returnToField] = response;
				}
			}

			// Register it as Blackprint Node
			Blackprint.registerNode(`Polkadot.js/${namespace}/${temp.name}/${funcName}`, GeneratedNode);
		}
	}
}