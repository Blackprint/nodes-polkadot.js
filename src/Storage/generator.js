/**
 * import { Substrate_BlackprintNodeGenerator } from "../utils/SubstrateNodes.js";
 */

// This file may get changed on the future

// https://polkadot.js.org/docs/substrate/storage
// The parameters will be input port, and the returned data will be the output port
// The function name will be the node's name (ex: Author HasKey)

Substrate_BlackprintNodeGenerator({
	namespace: 'Storage',
	description: '[Experimental] Substrate Storage',
	apiPath: 'query',
	loose: true,
	typeAsName: true,
}, [
	{
		name: "Assets", rpc_path: "assets",
		funcs: `
			account(u32, AccountId32): Option<PalletAssetsAssetAccount>
			approvals(u32, AccountId32, AccountId32): Option<PalletAssetsApproval>
			asset(u32): Option<PalletAssetsAssetDetails>
			metadata(u32): PalletAssetsAssetMetadata
		`
	}, {
		name: "AuthorityDiscovery", rpc_path: "authorityDiscovery",
		funcs: `
			keys(): Vec<SpAuthorityDiscoveryAppPublic>
			nextKeys(): Vec<SpAuthorityDiscoveryAppPublic>
		`
	}, {
		name: "Authorship", rpc_path: "authorship",
		funcs: `
			author(): Option<AccountId32>
			didSetUncles(): bool
			uncles(): Vec<PalletAuthorshipUncleEntryItem>
		`
	}, {
		name: "Babe", rpc_path: "babe",
		funcs: `
			authorities(): Vec<(SpConsensusBabeAppPublic,u64)>
			authorVrfRandomness(): Option<[u8;32]>
			currentSlot(): u64
			epochConfig(): Option<SpConsensusBabeBabeEpochConfiguration>
			epochIndex(): u64
			epochStart(): (u32,u32)
			genesisSlot(): u64
			initialized(): Option<Option<[u8;32]>>
			lateness(): u32
			nextAuthorities(): Vec<(SpConsensusBabeAppPublic,u64)>
			nextEpochConfig(): Option<SpConsensusBabeBabeEpochConfiguration>
			nextRandomness(): [u8;32]
			pendingEpochConfigChange(): Option<SpConsensusBabeDigestsNextConfigDescriptor>
			randomness(): [u8;32]
			segmentIndex(): u32
			underConstruction(u32): Vec<[u8;32]>
		`
	}, {
		name: "BagsList", rpc_path: "bagsList",
		funcs: `
			counterForListNodes(): u32
			listBags(u64): Option<PalletBagsListListBag>
			listNodes(AccountId32): Option<PalletBagsListListNode>
		`
	}, {
		name: "Balances", rpc_path: "balances",
		funcs: `
			account(AccountId32): PalletBalancesAccountData
			locks(AccountId32): Vec<PalletBalancesBalanceLock>
			reserves(AccountId32): Vec<PalletBalancesReserveData>
			storageVersion(): PalletBalancesReleases
			totalIssuance(): u128
		`
	}, {
		name: "Bounties", rpc_path: "bounties",
		funcs: `
			bounties(u32): Option<PalletBountiesBounty>
			bountyApprovals(): Vec<u32>
			bountyCount(): u32
			bountyDescriptions(u32): Option<Bytes>
		`
	}, {
		name: "ChildBounties", rpc_path: "childBounties",
		funcs: `
			childBounties(u32, u32): Option<PalletChildBountiesChildBounty>
			childBountyCount(): u32
			childBountyDescriptions(u32): Option<Bytes>
			childrenCuratorFees(u32): u128
			parentChildBounties(u32): u32
		`
	}, {
		name: "Contracts", rpc_path: "contracts",
		funcs: `
			accountCounter(): u64
			codeStorage(H256): Option<PalletContractsWasmPrefabWasmModule>
			contractInfoOf(AccountId32): Option<PalletContractsStorageRawContractInfo>
			deletionQueue(): Vec<PalletContractsStorageDeletedContract>
			ownerInfoOf(H256): Option<PalletContractsWasmOwnerInfo>
			pristineCode(H256): Option<Bytes>
		`
	}, {
		name: "Council", rpc_path: "council",
		funcs: `
			members(): Vec<AccountId32>
			prime(): Option<AccountId32>
			proposalCount(): u32
			proposalOf(H256): Option<Call>
			proposals(): Vec<H256>
			voting(H256): Option<PalletCollectiveVotes>
		`
	}, {
		name: "Democracy", rpc_path: "democracy",
		funcs: `
			blacklist(H256): Option<(u32,Vec<AccountId32>)>
			cancellations(H256): bool
			depositOf(u32): Option<(Vec<AccountId32>,u128)>
			lastTabledWasExternal(): bool
			locks(AccountId32): Option<u32>
			lowestUnbaked(): u32
			nextExternal(): Option<(H256,PalletDemocracyVoteThreshold)>
			preimages(H256): Option<PalletDemocracyPreimageStatus>
			publicPropCount(): u32
			publicProps(): Vec<(u32,H256,AccountId32)>
			referendumCount(): u32
			referendumInfoOf(u32): Option<PalletDemocracyReferendumInfo>
			storageVersion(): Option<PalletDemocracyReleases>
			votingOf(AccountId32): PalletDemocracyVoteVoting
		`
	}, {
		name: "ElectionProviderMultiPhase", rpc_path: "electionProviderMultiPhase",
		funcs: `
			currentPhase(): PalletElectionProviderMultiPhasePhase
			desiredTargets(): Option<u32>
			minimumUntrustedScore(): Option<[u128;3]>
			queuedSolution(): Option<PalletElectionProviderMultiPhaseReadySolution>
			round(): u32
			signedSubmissionIndices(): BTreeMap<[u128;3], u32>
			signedSubmissionNextIndex(): u32
			signedSubmissionsMap(u32): Option<PalletElectionProviderMultiPhaseSignedSignedSubmission>
			snapshot(): Option<PalletElectionProviderMultiPhaseRoundSnapshot>
			snapshotMetadata(): Option<PalletElectionProviderMultiPhaseSolutionOrSnapshotSize>
		`
	}, {
		name: "Elections", rpc_path: "elections",
		funcs: `
			candidates(): Vec<(AccountId32,u128)>
			electionRounds(): u32
			members(): Vec<PalletElectionsPhragmenSeatHolder>
			runnersUp(): Vec<PalletElectionsPhragmenSeatHolder>
			voting(AccountId32): PalletElectionsPhragmenVoter
		`
	}, {
		name: "Gilt", rpc_path: "gilt",
		funcs: `
			active(u32): Option<PalletGiltActiveGilt>
			activeTotal(): PalletGiltActiveGiltsTotal
			queues(u32): Vec<PalletGiltGiltBid>
			queueTotals(): Vec<(u32,u128)>
		`
	}, {
		name: "Grandpa", rpc_path: "grandpa",
		funcs: `
			currentSetId(): u64
			nextForced(): Option<u32>
			pendingChange(): Option<PalletGrandpaStoredPendingChange>
			setIdSession(u64): Option<u32>
			stalled(): Option<(u32,u32)>
			state(): PalletGrandpaStoredState
		`
	}, {
		name: "Identity", rpc_path: "identity",
		funcs: `
			identityOf(AccountId32): Option<PalletIdentityRegistration>
			registrars(): Vec<Option<PalletIdentityRegistrarInfo>>
			subsOf(AccountId32): (u128,Vec<AccountId32>)
			superOf(AccountId32): Option<(AccountId32,Data)>
		`
	}, {
		name: "ImOnline", rpc_path: "imOnline",
		funcs: `
			authoredBlocks(u32, AccountId32): u32
			heartbeatAfter(): u32
			keys(): Vec<PalletImOnlineSr25519AppSr25519Public>
			receivedHeartbeats(u32, u32): Option<WrapperOpaque<PalletImOnlineBoundedOpaqueNetworkState>>
		`
	}, {
		name: "Indices", rpc_path: "indices",
		funcs: `
			accounts(u32): Option<(AccountId32,u128,bool)>
		`
	}, {
		name: "Lottery", rpc_path: "lottery",
		funcs: `
			callIndices(): Vec<(u8,u8)>
			lottery(): Option<PalletLotteryLotteryConfig>
			lotteryIndex(): u32
			participants(AccountId32): (u32,Vec<(u8,u8)>)
			tickets(u32): Option<AccountId32>
			ticketsCount(): u32
		`
	}, {
		name: "Mmr", rpc_path: "mmr",
		funcs: `
			nodes(u64): Option<H256>
			numberOfLeaves(): u64
			rootHash(): H256
		`
	}, {
		name: "Multisig", rpc_path: "multisig",
		funcs: `
			calls([u8;32]): Option<(WrapperKeepOpaque<Call>,AccountId32,u128)>
			multisigs(AccountId32, [u8;32]): Option<PalletMultisigMultisig>
		`
	}, {
		name: "Offences", rpc_path: "offences",
		funcs: `
			concurrentReportsIndex([u8;16], Bytes): Vec<H256>
			reports(H256): Option<SpStakingOffenceOffenceDetails>
			reportsByKindIndex([u8;16]): Bytes
		`
	}, {
		name: "Preimage", rpc_path: "preimage",
		funcs: `
			preimageFor(H256): Option<Bytes>
			statusFor(H256): Option<PalletPreimageRequestStatus>
		`
	}, {
		name: "Proxy", rpc_path: "proxy",
		funcs: `
			announcements(AccountId32): (Vec<PalletProxyAnnouncement>,u128)
			proxies(AccountId32): (Vec<PalletProxyProxyDefinition>,u128)
		`
	}, {
		name: "RandomnessCollectiveFlip", rpc_path: "randomnessCollectiveFlip",
		funcs: `
			randomMaterial(): Vec<H256>
		`
	}, {
		name: "Recovery", rpc_path: "recovery",
		funcs: `
			activeRecoveries(AccountId32, AccountId32): Option<PalletRecoveryActiveRecovery>
			proxy(AccountId32): Option<AccountId32>
			recoverable(AccountId32): Option<PalletRecoveryRecoveryConfig>
		`
	}, {
		name: "Scheduler", rpc_path: "scheduler",
		funcs: `
			agenda(u32): Vec<Option<PalletSchedulerScheduledV3>>
			lookup(Bytes): Option<(u32,u32)>
		`
	}, {
		name: "Session", rpc_path: "session",
		funcs: `
			currentIndex(): u32
			disabledValidators(): Vec<u32>
			keyOwner((SpCoreCryptoKeyTypeId,Bytes)): Option<AccountId32>
			nextKeys(AccountId32): Option<NodeRuntimeSessionKeys>
			queuedChanged(): bool
			queuedKeys(): Vec<(AccountId32,NodeRuntimeSessionKeys)>
			validators(): Vec<AccountId32>
		`
	}, {
		name: "Society", rpc_path: "society",
		funcs: `
			bids(): Vec<PalletSocietyBid>
			candidates(): Vec<PalletSocietyBid>
			defender(): Option<AccountId32>
			defenderVotes(AccountId32): Option<PalletSocietyVote>
			founder(): Option<AccountId32>
			head(): Option<AccountId32>
			maxMembers(): u32
			members(): Vec<AccountId32>
			payouts(AccountId32): Vec<(u32,u128)>
			pot(): u128
			rules(): Option<H256>
			strikes(AccountId32): u32
			suspendedCandidates(AccountId32): Option<(u128,PalletSocietyBidKind)>
			suspendedMembers(AccountId32): bool
			votes(AccountId32, AccountId32): Option<PalletSocietyVote>
			vouching(AccountId32): Option<PalletSocietyVouchingStatus>
		`
	}, {
		name: "Staking", rpc_path: "staking",
		funcs: `
			activeEra(): Option<PalletStakingActiveEraInfo>
			bonded(AccountId32): Option<AccountId32>
			bondedEras(): Vec<(u32,u32)>
			canceledSlashPayout(): u128
			chillThreshold(): Option<Percent>
			counterForNominators(): u32
			counterForValidators(): u32
			currentEra(): Option<u32>
			currentPlannedSession(): u32
			earliestUnappliedSlash(): Option<u32>
			erasRewardPoints(u32): PalletStakingEraRewardPoints
			erasStakers(u32, AccountId32): PalletStakingExposure
			erasStakersClipped(u32, AccountId32): PalletStakingExposure
			erasStartSessionIndex(u32): Option<u32>
			erasTotalStake(u32): u128
			erasValidatorPrefs(u32, AccountId32): PalletStakingValidatorPrefs
			erasValidatorReward(u32): Option<u128>
			forceEra(): PalletStakingForcing
			historyDepth(): u32
			invulnerables(): Vec<AccountId32>
			ledger(AccountId32): Option<PalletStakingStakingLedger>
			maxNominatorsCount(): Option<u32>
			maxValidatorsCount(): Option<u32>
			minCommission(): Perbill
			minimumValidatorCount(): u32
			minNominatorBond(): u128
			minValidatorBond(): u128
			nominators(AccountId32): Option<PalletStakingNominations>
			nominatorSlashInEra(u32, AccountId32): Option<u128>
			offendingValidators(): Vec<(u32,bool)>
			payee(AccountId32): PalletStakingRewardDestination
			slashingSpans(AccountId32): Option<PalletStakingSlashingSlashingSpans>
			slashRewardFraction(): Perbill
			spanSlash((AccountId32,u32)): PalletStakingSlashingSpanRecord
			storageVersion(): PalletStakingReleases
			unappliedSlashes(u32): Vec<PalletStakingUnappliedSlash>
			validatorCount(): u32
			validators(AccountId32): PalletStakingValidatorPrefs
			validatorSlashInEra(u32, AccountId32): Option<(Perbill,u128)>
		`
	}, {
		name: "Substrate", rpc_path: "substrate",
		funcs: `
			changesTrieConfig(): u32
			childStorageKeyPrefix(): u32
			code(): Bytes
			extrinsicIndex(): u32
			heapPages(): u64
		`
	}, {
		name: "Sudo", rpc_path: "sudo",
		funcs: `
			key(): Option<AccountId32>
		`
	}, {
		name: "System", rpc_path: "system",
		funcs: `
			account(AccountId32): FrameSystemAccountInfo
			allExtrinsicsLen(): Option<u32>
			blockHash(u32): H256
			blockWeight(): FrameSupportWeightsPerDispatchClassU64
			digest(): SpRuntimeDigest
			eventCount(): u32
			events(): Vec<FrameSystemEventRecord>
			eventTopics(H256): Vec<(u32,u32)>
			executionPhase(): Option<FrameSystemPhase>
			extrinsicCount(): Option<u32>
			extrinsicData(u32): Bytes
			lastRuntimeUpgrade(): Option<FrameSystemLastRuntimeUpgradeInfo>
			number(): u32
			parentHash(): H256
			upgradedToTripleRefCount(): bool
			upgradedToU32RefCount(): bool
		`
	}, {
		name: "TechnicalCommittee", rpc_path: "technicalCommittee",
		funcs: `
			members(): Vec<AccountId32>
			prime(): Option<AccountId32>
			proposalCount(): u32
			proposalOf(H256): Option<Call>
			proposals(): Vec<H256>
			voting(H256): Option<PalletCollectiveVotes>
		`
	}, {
		name: "TechnicalMembership", rpc_path: "technicalMembership",
		funcs: `
			members(): Vec<AccountId32>
			prime(): Option<AccountId32>
		`
	}, {
		name: "Timestamp", rpc_path: "timestamp",
		funcs: `
			didUpdate(): bool
			now(): u64
		`
	}, {
		name: "Tips", rpc_path: "tips",
		funcs: `
			reasons(H256): Option<Bytes>
			tips(H256): Option<PalletTipsOpenTip>
		`
	}, {
		name: "TransactionPayment", rpc_path: "transactionPayment",
		funcs: `
			nextFeeMultiplier(): u128
			storageVersion(): PalletTransactionPaymentReleases
		`
	}, {
		name: "TransactionStorage", rpc_path: "transactionStorage",
		funcs: `
			blockTransactions(): Vec<PalletTransactionStorageTransactionInfo>
			byteFee(): Option<u128>
			chunkCount(u32): u32
			entryFee(): Option<u128>
			maxBlockTransactions(): u32
			maxTransactionSize(): u32
			proofChecked(): bool
			storagePeriod(): u32
			transactions(u32): Option<Vec<PalletTransactionStorageTransactionInfo>>
		`
	}, {
		name: "Treasury", rpc_path: "treasury",
		funcs: `
			approvals(): Vec<u32>
			proposalCount(): u32
			proposals(u32): Option<PalletTreasuryProposal>
		`
	}, {
		name: "Uniques", rpc_path: "uniques",
		funcs: `
			account(AccountId32, u32, u32): Option<Null>
			asset(u32, u32): Option<PalletUniquesInstanceDetails>
			attribute(u32, Option<u32>, Bytes): Option<(Bytes,u128)>
			class(u32): Option<PalletUniquesClassDetails>
			classAccount(AccountId32, u32): Option<Null>
			classMetadataOf(u32): Option<PalletUniquesClassMetadata>
			instanceMetadataOf(u32, u32): Option<PalletUniquesInstanceMetadata>
		`
	}, {
		name: "Vesting", rpc_path: "vesting",
		funcs: `
			storageVersion(): PalletVestingReleases
			vesting(AccountId32): Option<Vec<PalletVestingVestingInfo>>
		`
	}
]);