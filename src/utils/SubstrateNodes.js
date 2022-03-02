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

// ToDo: Type mapping (Rust Types => JavaScript Types)
let SubstrateTypeData = {
	'AccountId': String,
	'ApplyExtrinsicResult': null,
	'BeefySignedCommitment': null,
	'BlockHash': null,
	'BlockNumber': Number,
	'Bytes': String,
	'ChainProperties': null,
	'ChainType': null,
	'ContractCallRequest': null,
	'ContractExecResult': null,
	'ContractInstantiateResult': null,
	'CreatedBlock': null,
	'EthAccount': null,
	'EthCallRequest': null,
	'EthFilter': null,
	'EthFilterChanges': null,
	'EthReceipt': null,
	'EthRichBlock': null,
	'EthSubKind': null,
	'EthSubParams': null,
	'EthSyncStatus': null,
	'EthTransaction': null,
	'EthTransactionRequest': null,
	'EthWork': null,
	'Extrinsic': null,
	'ExtrinsicStatus': null,
	'FeeDetails': null,
	'H64': String,
	'H160': String,
	'H256': String,
	'Hash': String,
	'HashMap<AuthorityId,EpochAuthorship>': null, // ToDo: HashMap<A, B> => {A, B}
	'Header': null,
	'Health': null,
	'Index': null,
	'InstantiateRequest': null,
	'Json': null,
	'Justification': null,
	'JustificationNotification': null,
	'Metadata': null,
	'MmrLeafProof': null,
	'NetworkState': null,
	'Null': null,
	'Option<BlockNumber>': null, // ToDo: Option<A> => A
	'Option<Bytes>': null,
	'Option<EncodedFinalityProofs>': null,
	'Option<EthRichBlock>': null,
	'Option<Hash>': null,
	'Option<StorageData>': null,
	'Option<Text>': null,
	'Option<u64>': null,
	'PrefixedStorageKey': null,
	'ReadProof': null,
	'ReportedRoundStates': null,
	'RpcMethods': null,
	'RuntimeDispatchInfo': null,
	'RuntimeVersion': null,
	'SignedBlock': null,
	'StorageChangeSet': null,
	'StorageData': null,
	'StorageKey': null,
	'StorageKind': null,
	'String': null,
	'SyncState': null,
	'Text': String,
	'TraceBlockResponse': null,
	'U64': Number,
	'U256': Number,
	'Vec<EthLog>': null, // ToDo: Vec<A> => [A]
	'Vec<Extrinsic>': null,
	'Vec<ExtrinsicOrHash>': null,
	'Vec<H160>': null,
	'Vec<H256>': null,
	'Vec<Hash>': null,
	'Vec<KeyValue>': null,
	'Vec<NodeRole>': null,
	'Vec<Option<StorageData>>': null, // ToDo: ?.. maybe [StorageData]
	'Vec<PeerInfo>': null,
	'Vec<StorageChangeSet>': null,
	'Vec<StorageKey>': null,
	'Vec<Text>': null,
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
		if(options.returnType === false)
			temp += ':Any';

		// For Substrate Constants
		if(options.isConst)
			temp = temp.replace(':', '():');

		// Separate name, parameter, and types
		// ex: hasSessionKeys(sessionKeys:Bytes):bool
		;([temp, returnType] = temp.split('):'));
		;([funcName, args] = temp.split('('));

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
				argsObj[name] = args[a];
			}
		}

		// Put the extraction in the 'list'
		list[i] = {
			name: funcName.slice(0, 1).toUpperCase() + funcName.slice(1),
			args: argsObj,
			returnType
		};
	}

	return list;
}

/**
 * Generate Blackprint nodes for Substrate RPC
 * @param Array list [description]
 */
function Substrate_BlackprintNodeGenerator(options, list){
	if(SubstrateMetadata === false) return;

	let { namespace, description, apiPath, isConst } = options;

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
			let preprocessType = null;
			if(func.returnType !== 'Null'){
				// Simplify port name
				let portName = func.returnType
					.replace(/(Vec|Option|HashMap)<(.*?)>$/m, function(full, wrapper, type){
						if(wrapper === 'Option' || wrapper === 'Vec')
							return type;

						// ToDO: HashMap
						return type;
					});

				if(options.loose && SubstrateTypeData[func.returnType] === void 0)
					SubstrateTypeData[func.returnType] = null;

				preprocessType = SubstrateTypeData[func.returnType];

				// This will be used as output port
				// port name => type
				func.returnType = {
					[portName]: SubstrateTypeData[func.returnType]
				};

				returnToField = portName;
			}
			else func.returnType = void 0; // Didn't return data

			// Type mapping (Rust Types => JavaScript Types)
			let args = func.args;
			let RPCParams = Object.keys(args);
			for(let portName in args){
				let typeData = args[portName];

				if(options.loose && SubstrateTypeData[typeData] === void 0)
					SubstrateTypeData[typeData] = null;

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
				return ' By/'+name;
			})
			.replace(/^(Get|Set|Has|New)([A-Z].*)/, function(full, category, name){
				return category + '/' +name;
			})
			// Add space between words
			.replace(/([a-z])([A-Z])/g, function(full, A, B){
				return A + ' ' +B;
			});

			// Capitalize the first character
			let apiName = func.name.slice(0, 1).toLowerCase() + func.name.slice(1);

			let defaultInput = {
				API: polkadotApi.ApiPromise,
				Trigger: Blackprint.Port.Trigger(function(){
					this.trigger(); // this.trigger => async trigger()
				})
			};

			// For Substrate Constants
			if(isConst) delete defaultInput.Trigger;

			// Custom Node class
			class GeneratedNode extends Blackprint.Node {
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
						if(Input.API[apiPath][temp.rpc_path][apiName] == null){
							this._toast.error("This network doesn't support this feature");
							return;
						}
					}
					else Output[returnToField] = null;

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

					if(preprocessType != null)
						response = preprocessType(response);

					// ToDo: should we use type data's name as the port name?
					Output[returnToField] = response;
				}
			}

			// Register it as Blackprint Node
			Blackprint.registerNode(`Polkadot.js/${namespace}/${temp.name}/${funcName}`, GeneratedNode);
		}
	}
}