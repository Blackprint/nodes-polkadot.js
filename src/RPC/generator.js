/**
 * import { Substrate_BlackprintNodeGenerator } from "../utils/SubstrateNodes.js";
 */

// Work in progress and untested nodes
// Please expect changes on the port's name and type data on the future

// https://polkadot.js.org/docs/substrate/rpc
// The parameters will be input port, and the returned data will be the output port
// The function name will be the node's name (ex: Author HasKey)
Substrate_BlackprintNodeGenerator({
	namespace: 'RPC',
	description: '[Experimental] Substrate JSON-RPC',
	apiPath: 'rpc'
}, [
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
		name: "Net", rpc_path: "net",
		funcs: `
			listening(): bool
			peerCount(): String
			version(): String
		`
	}, {
		name: "Web3", rpc_path: "web3",
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