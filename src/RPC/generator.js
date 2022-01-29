// Work in progress
let SubstrateMetadata = true; // set this to true to enable this generator

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
	'HashMap<AuthorityId,EpochAuthorship>': null,
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
	'Option<BlockNumber>': null,
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
	'Vec<EthLog>': null,
	'Vec<Extrinsic>': null,
	'Vec<ExtrinsicOrHash>': null,
	'Vec<H160>': null,
	'Vec<H256>': null,
	'Vec<Hash>': null,
	'Vec<KeyValue>': null,
	'Vec<NodeRole>': null,
	'Vec<Option<StorageData>>': null,
	'Vec<PeerInfo>': null,
	'Vec<StorageChangeSet>': null,
	'Vec<StorageKey>': null,
	'Vec<Text>': null,
	'bool': Boolean,
	'u32': Number,
	'u64': Number,
};

// https://polkadot.js.org/docs/substrate/rpc
Substrate_BlackprintNodeGenerator([
	{
		name: "Author", rpc_path: "author",
		funcs: `
			hasKey(publicKey: Bytes, keyType: Text): bool
			hasSessionKeys(sessionKeys: Bytes): bool
			insertKey(keyType: Text, suri: Text, publicKey: Bytes): Bytes
			pendingExtrinsics(): Vec<Extrinsic>
			removeExtrinsic(bytesOrHash: Vec<ExtrinsicOrHash>): Vec<Hash>
			rotateKeys(): Bytes
			submitAndWatchExtrinsic(extrinsic: Extrinsic): ExtrinsicStatus
			submitExtrinsic(extrinsic: Extrinsic): Hash
		`
	}, {
		name: "Babe", rpc_path: "babe",
		funcs: `
			epochAuthorship(): HashMap<AuthorityId, EpochAuthorship>
		`
	}, {
		name: "Beefy", rpc_path: "beefy",
		funcs: `
			subscribeJustifications(): BeefySignedCommitment
		`
	}, {
		name: "Chain", rpc_path: "chain",
		funcs: `
			getBlock(hash?: BlockHash): SignedBlock
			getBlockHash(blockNumber?: BlockNumber): BlockHash
			getFinalizedHead(): BlockHash
			getHeader(hash?: BlockHash): Header
			subscribeAllHeads(): Header
			subscribeFinalizedHeads(): Header
			subscribeNewHeads(): Header
		`
	}, {
		name: "ChildState", rpc_path: "childstate",
		funcs: `
			getKeys(childKey: PrefixedStorageKey, prefix: StorageKey, at?: Hash): Vec<StorageKey>
			getKeysPaged(childKey: PrefixedStorageKey, prefix: StorageKey, count: u32, startKey?: StorageKey, at?: Hash): Vec<StorageKey>
			getStorage(childKey: PrefixedStorageKey, key: StorageKey, at?: Hash): Option<StorageData>
			getStorageEntries(childKey: PrefixedStorageKey, keys: Vec<StorageKey>, at?: Hash): Vec<Option<StorageData>>
			getStorageHash(childKey: PrefixedStorageKey, key: StorageKey, at?: Hash): Option<Hash>
			getStorageSize(childKey: PrefixedStorageKey, key: StorageKey, at?: Hash): Option<u64>
		`
	}, {
		name: "Contracts", rpc_path: "contracts",
		funcs: `
			call(callRequest: ContractCallRequest, at?: BlockHash): ContractExecResult
			getStorage(address: AccountId, key: H256, at?: BlockHash): Option<Bytes>
			instantiate(request: InstantiateRequest, at?: BlockHash): ContractInstantiateResult
			rentProjection(address: AccountId, at?: BlockHash): Option<BlockNumber>
		`
	}, {
		name: "Engine", rpc_path: "engine",
		funcs: `
			createBlock(createEmpty: bool, finalize: bool, parentHash?: BlockHash): CreatedBlock
			finalizeBlock(hash: BlockHash, justification?: Justification): bool
		`
	}, {
		name: "Eth", rpc_path: "eth",
		funcs: `
			accounts(): Vec<H160>
			blockNumber(): U256
			call(request: EthCallRequest, number?: BlockNumber): Bytes
			chainId(): U64
			coinbase(): H160
			estimateGas(request: EthCallRequest, number?: BlockNumber): U256
			gasPrice(): U256
			getBalance(address: H160, number?: BlockNumber): U256
			getBlockByHash(hash: H256, full: bool): Option<EthRichBlock>
			getBlockByNumber(block: BlockNumber, full: bool): Option<EthRichBlock>
			getBlockTransactionCountByHash(hash: H256): U256
			getBlockTransactionCountByNumber(block: BlockNumber): U256
			getCode(address: H160, number?: BlockNumber): Bytes
			getFilterChanges(index: U256): EthFilterChanges
			getFilterLogs(index: U256): Vec<EthLog>
			getLogs(filter: EthFilter): Vec<EthLog>
			getProof(address: H160, storageKeys: Vec<H256>, number: BlockNumber): EthAccount
			getStorageAt(address: H160, index: U256, number?: BlockNumber): H256
			getTransactionByBlockHashAndIndex(hash: H256, index: U256): EthTransaction
			getTransactionByBlockNumberAndIndex(number: BlockNumber, index: U256): EthTransaction
			getTransactionByHash(hash: H256): EthTransaction
			getTransactionCount(hash: H256, number?: BlockNumber): U256
			getTransactionReceipt(hash: H256): EthReceipt
			getUncleByBlockHashAndIndex(hash: H256, index: U256): EthRichBlock
			getUncleByBlockNumberAndIndex(number: BlockNumber, index: U256): EthRichBlock
			getUncleCountByBlockHash(hash: H256): U256
			getUncleCountByBlockNumber(number: BlockNumber): U256
			getWork(): EthWork
			hashrate(): U256
			mining(): bool
			newBlockFilter(): U256
			newFilter(filter: EthFilter): U256
			newPendingTransactionFilter(): U256
			protocolVersion(): u64
			sendRawTransaction(bytes: Bytes): H256
			sendTransaction(tx: EthTransactionRequest): H256
			submitHashrate(index: U256, hash: H256): bool
			submitWork(nonce: H64, headerHash: H256, mixDigest: H256): bool
			subscribe(kind: EthSubKind, params?: EthSubParams): Null
			syncing(): EthSyncStatus
			uninstallFilter(index: U256): bool
		`
	}, {
		name: "Eth/Net", rpc_path: "net",
		funcs: `
			listening(): bool
			peerCount(): String
			version(): String
		`
	}, {
		name: "Eth/Web3", rpc_path: "web3",
		funcs: `
			clientVersion(): String
			sha3(data: Bytes): H256
		`
	}, {
		name: "Grandpa", rpc_path: "grandpa",
		funcs: `
			proveFinality(begin: BlockHash, end: BlockHash, authoritiesSetId?: u64): Option<EncodedFinalityProofs>
			roundState(): ReportedRoundStates
			subscribeJustifications(): JustificationNotification
		`
	}, {
		name: "Mmr", rpc_path: "mmr",
		funcs: `
			generateProof(leafIndex: u64, at?: BlockHash): MmrLeafProof
		`
	}, {
		name: "OffChain", rpc_path: "offchain",
		funcs: `
			localStorageGet(kind: StorageKind, key: Bytes): Option<Bytes>
			localStorageSet(kind: StorageKind, key: Bytes, value: Bytes): Null
		`
	}, {
		name: "Payment", rpc_path: "payment",
		funcs: `
			queryFeeDetails(extrinsic: Bytes, at?: BlockHash): FeeDetails
			queryInfo(extrinsic: Bytes, at?: BlockHash): RuntimeDispatchInfo
		`
	}, {
		name: "RPC", rpc_path: "rpc",
		funcs: `
			methods(): RpcMethods
		`
	}, {
		name: "State", rpc_path: "state",
		funcs: `
			call(method: Text, data: Bytes, at?: BlockHash): Bytes
			getChildKeys(childStorageKey: StorageKey, childDefinition: StorageKey, childType: u32, key: StorageKey, at?: BlockHash): Vec<StorageKey>
			getChildReadProof(childStorageKey: PrefixedStorageKey, keys: Vec<StorageKey>, at?: BlockHash): ReadProof
			getChildStorage(childStorageKey: StorageKey, childDefinition: StorageKey, childType: u32, key: StorageKey, at?: BlockHash): StorageData
			getChildStorageHash(childStorageKey: StorageKey, childDefinition: StorageKey, childType: u32, key: StorageKey, at?: BlockHash): Hash
			getChildStorageSize(childStorageKey: StorageKey, childDefinition: StorageKey, childType: u32, key: StorageKey, at?: BlockHash): u64
			getKeys(key: StorageKey, at?: BlockHash): Vec<StorageKey>
			getKeysPaged(key: StorageKey, count: u32, startKey?: StorageKey, at?: BlockHash): Vec<StorageKey>
			getMetadata(at?: BlockHash): Metadata
			getPairs(prefix: StorageKey, at?: BlockHash): Vec<KeyValue>
			getReadProof(keys: Vec<StorageKey>, at?: BlockHash): ReadProof
			getRuntimeVersion(at?: BlockHash): RuntimeVersion
			getStorage(key: StorageKey, at?: BlockHash): StorageData
			getStorageHash(key: StorageKey, at?: BlockHash): Hash
			getStorageSize(key: StorageKey, at?: BlockHash): u64
			queryStorage(keys: Vec<StorageKey>, fromBlock: Hash, toBlock?: BlockHash): Vec<StorageChangeSet>
			queryStorageAt(keys: Vec<StorageKey>, at?: BlockHash): Vec<StorageChangeSet>
			subscribeRuntimeVersion(): RuntimeVersion
			subscribeStorage(keys?: Vec<StorageKey>): StorageChangeSet
			traceBlock(block: Hash, targets: Option<Text>, storageKeys: Option<Text>, methods: Option<Text>): TraceBlockResponse
		`
	}, {
		name: "SyncState", rpc_path: "syncstate",
		funcs: `
			genSyncSpec(raw: bool): Json
		`
	}, {
		name: "System", rpc_path: "system",
		funcs: `
			accountNextIndex(accountId: AccountId): Index
			addLogFilter(directives: Text): Null
			addReservedPeer(peer: Text): Text
			chain(): Text
			chainType(): ChainType
			dryRun(extrinsic: Bytes, at?: BlockHash): ApplyExtrinsicResult
			health(): Health
			localListenAddresses(): Vec<Text>
			localPeerId(): Text
			name(): Text
			networkState(): NetworkState
			nodeRoles(): Vec<NodeRole>
			peers(): Vec<PeerInfo>
			properties(): ChainProperties
			removeReservedPeer(peerId: Text): Text
			reservedPeers(): Vec<Text>
			resetLogFilter(): Null
			syncState(): SyncState
			version(): Text
		`
	}
]);

function functionParser(str){
	let list = str.trim().replace(/\t+| /g, '').split('\n');

	for (var i = 0; i < list.length; i++) {
		let temp = list[i];
		let funcName, args, returnType;

		// hasSessionKeys ( sessionKeys:Bytes ): bool
		;([temp, returnType] = temp.split('):'));
		;([funcName, args] = temp.split('('));

		let argsName = [];
		args = args.replace(/,?([a-zA-Z0-9_?]+):/g, function(full, name){
			argsName.push(name);
			return ';;';
		}).replace(/^;;/m, '');

		let argsObj = {};
		if(args !== ''){
			args = args.split(';;');

			for (var a = 0; a < args.length; a++) {
				let name = argsName[a];
				name = name.slice(0, 1).toUpperCase() + name.slice(1);
				argsObj[name] = args[a];
			}
		}

		list[i] = {
			name: funcName.slice(0, 1).toUpperCase() + funcName.slice(1),
			args: argsObj,
			returnType
		};
	}

	return list;
}

function Substrate_BlackprintNodeGenerator(list){
	if(SubstrateMetadata === false) return;

	for (var i = 0; i < list.length; i++) {
		let temp = list[i];
		let funcs = functionParser(temp.funcs);

		// For each function
		that: for (var a = 0; a < funcs.length; a++) {
			let func = funcs[a];

			// Skip subscribe or watch because it was an event
			if(/subscribe|watch/i.test(func.name)){
				if(SubstrateSubscriber[func.name] === void 0)
					console.error(`Substrate subscriber for "${func.name}" was not found`);

				continue;
			}

			if(SubstrateTypeData[func.returnType] === void 0){
				console.error(`Substrate type data for "${func.returnType}" was not found`);
				continue;
			}

			let returnToField = func.returnType;
			if(func.returnType !== 'Null'){
				func.returnType = {
					[func.returnType]: SubstrateTypeData[func.returnType]
				};
			}
			else func.returnType = void 0;

			let args = func.args;
			for(let key in args){
				let typeData = args[key];

				if(SubstrateTypeData[typeData] === void 0){
					console.error(`Substrate type data for "${typeData}" was not found`);
					continue that;
				}

				args[key] = SubstrateTypeData[typeData];
			}

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

			let apiName = func.name.slice(0, 1).toLowerCase() + func.name.slice(1);

			args.API = polkadotApi.ApiPromise;
			args.Trigger = Blackprint.Port.Trigger(function(){
				this.trigger(); // this instanceof Blackprint.Node
			});

			class GeneratedNode extends Blackprint.Node {
				static input = args;
				static output = func.returnType;

				constructor(instance){
					super(instance);

					let node = this;
					let iface = this.setInterface();
					iface.title = temp.name +' '+ func.name;
					iface.description = "Polkadot JSON-RPC";

					this._toast = new NodeToast(iface);
				}

				async trigger(){
					let {Input, Output, IInput, IOutput} = this.ref; // Shortcut
					let toast = this._toast;

					if(Input.API === null)
						return toast.warn("API is required");

					let obj = Input.API.rpc[temp.rpc_path];
					let args = [];

					if(func.args !== void 0){
						let _args = func.args;
						for(let key in _args){
							args.push(Input[key]);
						}
					}

					Output[returnToField] = await obj[apiName].apply(obj, args);
				}
			}

			Blackprint.registerNode("Polkadot.js/RPC/"+temp.name+'/'+funcName, GeneratedNode);
		}
	}
}