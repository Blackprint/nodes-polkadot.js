/**
 * import { Substrate_BlackprintNodeGenerator } from "../utils/SubstrateNodes.js";
 */

// This file may get changed on the future

// https://polkadot.js.org/docs/substrate/constants
// The parameters will be input port, and the returned data will be the output port
// The function name will be the node's name (ex: Author HasKey)

Substrate_BlackprintNodeGenerator({
	namespace: 'Constants',
	description: '[Experimental] Substrate Constants',
	apiPath: 'consts',
	loose: true,
	isConst: true,
}, [
	{
		name: "Assets", rpc_path: "assets",
		funcs: `
			approvalDeposit: u128
			assetAccountDeposit: u128
			assetDeposit: u128
			metadataDepositBase: u128
			metadataDepositPerByte: u128
			stringLimit: u32
		`
	}, {
		name: "Authorship", rpc_path: "authorship",
		funcs: `
			uncleGenerations: u32
		`
	}, {
		name: "Babe", rpc_path: "babe",
		funcs: `
			epochDuration: u64
			expectedBlockTime: u64
			maxAuthorities: u32
		`
	}, {
		name: "BagsList", rpc_path: "bagsList",
		funcs: `
			bagThresholds: Vec<u64>
		`
	}, {
		name: "Balances", rpc_path: "balances",
		funcs: `
			existentialDeposit: u128
			maxLocks: u32
			maxReserves: u32
		`
	}, {
		name: "Bounties", rpc_path: "bounties",
		funcs: `
			bountyCuratorDeposit: Permill
			bountyDepositBase: u128
			bountyDepositPayoutDelay: u32
			bountyUpdatePeriod: u32
			bountyValueMinimum: u128
			dataDepositPerByte: u128
			maximumReasonLength: u32
		`
	}, {
		name: "ChildBounties", rpc_path: "childBounties",
		funcs: `
			childBountyCuratorDepositBase: Permill
			childBountyValueMinimum: u128
			maxActiveChildBountyCount: u32
		`
	}, {
		name: "Contracts", rpc_path: "contracts",
		funcs: `
			deletionQueueDepth: u32
			deletionWeightLimit: u64
			depositPerByte: u128
			depositPerItem: u128
			schedule: PalletContractsSchedule
		`
	}, {
		name: "Democracy", rpc_path: "democracy",
		funcs: `
			cooloffPeriod: u32
			enactmentPeriod: u32
			fastTrackVotingPeriod: u32
			instantAllowed: bool
			launchPeriod: u32
			maxProposals: u32
			maxVotes: u32
			minimumDeposit: u128
			preimageByteDeposit: u128
			voteLockingPeriod: u32
			votingPeriod: u32
		`
	}, {
		name: "ElectionProviderMultiPhase", rpc_path: "electionProviderMultiPhase",
		funcs: `
			minerMaxLength: u32
			minerMaxWeight: u64
			minerTxPriority: u64
			offchainRepeat: u32
			signedDepositBase: u128
			signedDepositByte: u128
			signedDepositWeight: u128
			signedMaxSubmissions: u32
			signedMaxWeight: u64
			signedPhase: u32
			signedRewardBase: u128
			solutionImprovementThreshold: Perbill
			unsignedPhase: u32
			voterSnapshotPerBlock: u32
		`
	}, {
		name: "Elections", rpc_path: "elections",
		funcs: `
			candidacyBond: u128
			desiredMembers: u32
			desiredRunnersUp: u32
			palletId: [u8;8]
			termDuration: u32
			votingBondBase: u128
			votingBondFactor: u128
		`
	}, {
		name: "Gilt", rpc_path: "gilt",
		funcs: `
			fifoQueueLen: u32
			intakePeriod: u32
			maxIntakeBids: u32
			maxQueueLen: u32
			minFreeze: u128
			period: u32
			queueCount: u32
		`
	}, {
		name: "Grandpa", rpc_path: "grandpa",
		funcs: `
			maxAuthorities: u32
		`
	}, {
		name: "Identity", rpc_path: "identity",
		funcs: `
			basicDeposit: u128
			fieldDeposit: u128
			maxAdditionalFields: u32
			maxRegistrars: u32
			maxSubAccounts: u32
			subAccountDeposit: u128
		`
	}, {
		name: "ImOnline", rpc_path: "imOnline",
		funcs: `
			unsignedPriority: u64
		`
	}, {
		name: "Indices", rpc_path: "indices",
		funcs: `
			deposit: u128
		`
	}, {
		name: "Lottery", rpc_path: "lottery",
		funcs: `
			maxCalls: u32
			maxGenerateRandom: u32
			palletId: FrameSupportPalletId
		`
	}, {
		name: "Multisig", rpc_path: "multisig",
		funcs: `
			depositBase: u128
			depositFactor: u128
			maxSignatories: u16
		`
	}, {
		name: "Proxy", rpc_path: "proxy",
		funcs: `
			announcementDepositBase: u128
			announcementDepositFactor: u128
			maxPending: u32
			maxProxies: u32
			proxyDepositBase: u128
			proxyDepositFactor: u128
		`
	}, {
		name: "Recovery", rpc_path: "recovery",
		funcs: `
			configDepositBase: u128
			friendDepositFactor: u128
			maxFriends: u16
			recoveryDeposit: u128
		`
	}, {
		name: "Scheduler", rpc_path: "scheduler",
		funcs: `
			maximumWeight: u64
			maxScheduledPerBlock: u32
		`
	}, {
		name: "Society", rpc_path: "society",
		funcs: `
			candidateDeposit: u128
			challengePeriod: u32
			maxCandidateIntake: u32
			maxLockDuration: u32
			maxStrikes: u32
			palletId: FrameSupportPalletId
			periodSpend: u128
			rotationPeriod: u32
			wrongSideDeduction: u128
		`
	}, {
		name: "Staking", rpc_path: "staking",
		funcs: `
			bondingDuration: u32
			maxNominatorRewardedPerValidator: u32
			sessionsPerEra: u32
			slashDeferDuration: u32
		`
	}, {
		name: "System", rpc_path: "system",
		funcs: `
			blockHashCount: u32
			blockLength: FrameSystemLimitsBlockLength
			blockWeights: FrameSystemLimitsBlockWeights
			dbWeight: FrameSupportWeightsRuntimeDbWeight
			ss58Prefix: u16
			version: SpVersionRuntimeVersion
		`
	}, {
		name: "Timestamp", rpc_path: "timestamp",
		funcs: `
			minimumPeriod: u64
		`
	}, {
		name: "Tips", rpc_path: "tips",
		funcs: `
			dataDepositPerByte: u128
			maximumReasonLength: u32
			tipCountdown: u32
			tipFindersFee: Percent
			tipReportDepositBase: u128
		`
	}, {
		name: "TransactionPayment", rpc_path: "transactionPayment",
		funcs: `
			operationalFeeMultiplier: u8
			transactionByteFee: u128
			weightToFee: Vec<FrameSupportWeightsWeightToFeeCoefficient>
		`
	}, {
		name: "Treasury", rpc_path: "treasury",
		funcs: `
			burn: Permill
			maxApprovals: u32
			palletId: FrameSupportPalletId
			proposalBond: Permill
			proposalBondMaximum: Option<u128>
			proposalBondMinimum: u128
			spendPeriod: u32
		`
	}, {
		name: "Uniques", rpc_path: "uniques",
		funcs: `
			attributeDepositBase: u128
			classDeposit: u128
			depositPerByte: u128
			instanceDeposit: u128
			keyLimit: u32
			metadataDepositBase: u128
			stringLimit: u32
			valueLimit: u32
		`
	}, {
		name: "Utility", rpc_path: "utility",
		funcs: `
			batchedCallsLimit: u32
		`
	}, {
		name: "Vesting", rpc_path: "vesting",
		funcs: `
			maxVestingSchedules: u32
			minVestedTransfer: u128
		`
	}
]);