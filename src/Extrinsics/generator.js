/**
 * import { Substrate_BlackprintNodeGenerator } from "../utils/SubstrateNodes.js";
 */

// This file may get changed on the future

// https://polkadot.js.org/docs/substrate/storage
// The parameters will be input port, and the returned data will be the output port
// The function name will be the node's name (ex: Author HasKey)

Substrate_BlackprintNodeGenerator({
	namespace: 'Extrinsics',
	description: '[Experimental] Substrate Extrinsics',
	apiPath: 'tx',
	loose: true,
	returnType: false,
}, [
	{
		name: "Assets", rpc_path: "assets",
		funcs: `
			approveTransfer(id: Compact<u32>, delegate: MultiAddress, amount: Compact<u128>)
			burn(id: Compact<u32>, who: MultiAddress, amount: Compact<u128>)
			cancelApproval(id: Compact<u32>, delegate: MultiAddress)
			clearMetadata(id: Compact<u32>)
			create(id: Compact<u32>, admin: MultiAddress, min_balance: u128)
			destroy(id: Compact<u32>, witness: PalletAssetsDestroyWitness)
			forceAssetStatus(id: Compact<u32>, owner: MultiAddress, issuer: MultiAddress, admin: MultiAddress, freezer: MultiAddress, min_balance: Compact<u128>, is_sufficient: bool, is_frozen: bool)
			forceCancelApproval(id: Compact<u32>, owner: MultiAddress, delegate: MultiAddress)
			forceClearMetadata(id: Compact<u32>)
			forceCreate(id: Compact<u32>, owner: MultiAddress, is_sufficient: bool, min_balance: Compact<u128>)
			forceSetMetadata(id: Compact<u32>, name: Bytes, symbol: Bytes, decimals: u8, is_frozen: bool)
			forceTransfer(id: Compact<u32>, source: MultiAddress, dest: MultiAddress, amount: Compact<u128>)
			freeze(id: Compact<u32>, who: MultiAddress)
			freezeAsset(id: Compact<u32>)
			mint(id: Compact<u32>, beneficiary: MultiAddress, amount: Compact<u128>)
			refund(id: Compact<u32>, allow_burn: bool)
			setMetadata(id: Compact<u32>, name: Bytes, symbol: Bytes, decimals: u8)
			setTeam(id: Compact<u32>, issuer: MultiAddress, admin: MultiAddress, freezer: MultiAddress)
			thaw(id: Compact<u32>, who: MultiAddress)
			thawAsset(id: Compact<u32>)
			touch(id: Compact<u32>)
			transfer(id: Compact<u32>, target: MultiAddress, amount: Compact<u128>)
			transferApproved(id: Compact<u32>, owner: MultiAddress, destination: MultiAddress, amount: Compact<u128>)
			transferKeepAlive(id: Compact<u32>, target: MultiAddress, amount: Compact<u128>)
			transferOwnership(id: Compact<u32>, owner: MultiAddress)
		`
	}, {
		name: "Authorship", rpc_path: "authorship",
		funcs: `
			setUncles(new_uncles: Vec<SpRuntimeHeader>)
		`
	}, {
		name: "Babe", rpc_path: "babe",
		funcs: `
			planConfigChange(config: SpConsensusBabeDigestsNextConfigDescriptor)
			reportEquivocation(equivocation_proof: SpConsensusSlotsEquivocationProof, key_owner_proof: SpSessionMembershipProof)
			reportEquivocationUnsigned(equivocation_proof: SpConsensusSlotsEquivocationProof, key_owner_proof: SpSessionMembershipProof)
		`
	}, {
		name: "BagsList", rpc_path: "bagsList",
		funcs: `
			putInFrontOf(lighter: AccountId32)
			rebag(dislocated: AccountId32)
		`
	}, {
		name: "Balances", rpc_path: "balances",
		funcs: `
			forceTransfer(source: MultiAddress, dest: MultiAddress, value: Compact<u128>)
			forceUnreserve(who: MultiAddress, amount: u128)
			setBalance(who: MultiAddress, new_free: Compact<u128>, new_reserved: Compact<u128>)
			transfer(dest: MultiAddress, value: Compact<u128>)
			transferAll(dest: MultiAddress, keep_alive: bool)
			transferKeepAlive(dest: MultiAddress, value: Compact<u128>)
		`
	}, {
		name: "Bounties", rpc_path: "bounties",
		funcs: `
			acceptCurator(bounty_id: Compact<u32>)
			approveBounty(bounty_id: Compact<u32>)
			awardBounty(bounty_id: Compact<u32>, beneficiary: MultiAddress)
			claimBounty(bounty_id: Compact<u32>)
			closeBounty(bounty_id: Compact<u32>)
			extendBountyExpiry(bounty_id: Compact<u32>, remark: Bytes)
			proposeBounty(value: Compact<u128>, description: Bytes)
			proposeCurator(bounty_id: Compact<u32>, curator: MultiAddress, fee: Compact<u128>)
			unassignCurator(bounty_id: Compact<u32>)
		`
	}, {
		name: "ChildBounties", rpc_path: "childBounties",
		funcs: `
			acceptCurator(parent_bounty_id: Compact<u32>, child_bounty_id: Compact<u32>)
			addChildBounty(parent_bounty_id: Compact<u32>, value: Compact<u128>, description: Bytes)
			awardChildBounty(parent_bounty_id: Compact<u32>, child_bounty_id: Compact<u32>, beneficiary: MultiAddress)
			claimChildBounty(parent_bounty_id: Compact<u32>, child_bounty_id: Compact<u32>)
			closeChildBounty(parent_bounty_id: Compact<u32>, child_bounty_id: Compact<u32>)
			proposeCurator(parent_bounty_id: Compact<u32>, child_bounty_id: Compact<u32>, curator: MultiAddress, fee: Compact<u128>)
			unassignCurator(parent_bounty_id: Compact<u32>, child_bounty_id: Compact<u32>)
		`
	}, {
		name: "Contracts", rpc_path: "contracts",
		funcs: `
			call(dest: MultiAddress, value: Compact<u128>, gas_limit: Compact<u64>, storage_deposit_limit: Option<Compact<u128>>, data: Bytes)
			instantiate(value: Compact<u128>, gas_limit: Compact<u64>, storage_deposit_limit: Option<Compact<u128>>, code_hash: H256, data: Bytes, salt: Bytes)
			instantiateWithCode(value: Compact<u128>, gas_limit: Compact<u64>, storage_deposit_limit: Option<Compact<u128>>, code: Bytes, data: Bytes, salt: Bytes)
			removeCode(code_hash: H256)
			uploadCode(code: Bytes, storage_deposit_limit: Option<Compact<u128>>)
		`
	}, {
		name: "Council", rpc_path: "council",
		funcs: `
			close(proposal_hash: H256, index: Compact<u32>, proposal_weight_bound: Compact<u64>, length_bound: Compact<u32>)
			disapproveProposal(proposal_hash: H256)
			execute(proposal: Call, length_bound: Compact<u32>)
			propose(threshold: Compact<u32>, proposal: Call, length_bound: Compact<u32>)
			setMembers(new_members: Vec<AccountId32>, prime: Option<AccountId32>, old_count: u32)
			vote(proposal: H256, index: Compact<u32>, approve: bool)
		`
	}, {
		name: "Democracy", rpc_path: "democracy",
		funcs: `
			blacklist(proposal_hash: H256, maybe_ref_index: Option<u32>)
			cancelProposal(prop_index: Compact<u32>)
			cancelQueued(which: u32)
			cancelReferendum(ref_index: Compact<u32>)
			clearPublicProposals()
			delegate(to: AccountId32, conviction: PalletDemocracyConviction, balance: u128)
			emergencyCancel(ref_index: u32)
			enactProposal(proposal_hash: H256, index: u32)
			externalPropose(proposal_hash: H256)
			externalProposeDefault(proposal_hash: H256)
			externalProposeMajority(proposal_hash: H256)
			fastTrack(proposal_hash: H256, voting_period: u32, delay: u32)
			noteImminentPreimage(encoded_proposal: Bytes)
			noteImminentPreimageOperational(encoded_proposal: Bytes)
			notePreimage(encoded_proposal: Bytes)
			notePreimageOperational(encoded_proposal: Bytes)
			propose(proposal_hash: H256, value: Compact<u128>)
			reapPreimage(proposal_hash: H256, proposal_len_upper_bound: Compact<u32>)
			removeOtherVote(target: AccountId32, index: u32)
			removeVote(index: u32)
			second(proposal: Compact<u32>, seconds_upper_bound: Compact<u32>)
			undelegate()
			unlock(target: AccountId32)
			vetoExternal(proposal_hash: H256)
			vote(ref_index: Compact<u32>, vote: PalletDemocracyVoteAccountVote)
		`
	}, {
		name: "ElectionProviderMultiPhase", rpc_path: "electionProviderMultiPhase",
		funcs: `
			governanceFallback(maybe_max_voters: Option<u32>, maybe_max_targets: Option<u32>)
			setEmergencyElectionResult(supports: Vec<(AccountId32,SpNposElectionsSupport)>)
			setMinimumUntrustedScore(maybe_next_score: Option<[u128;3]>)
			submit(raw_solution: PalletElectionProviderMultiPhaseRawSolution, num_signed_submissions: u32)
			submitUnsigned(raw_solution: PalletElectionProviderMultiPhaseRawSolution, witness: PalletElectionProviderMultiPhaseSolutionOrSnapshotSize)
		`
	}, {
		name: "Elections", rpc_path: "elections",
		funcs: `
			cleanDefunctVoters(num_voters: u32, num_defunct: u32)
			removeMember(who: MultiAddress, has_replacement: bool)
			removeVoter()
			renounceCandidacy(renouncing: PalletElectionsPhragmenRenouncing)
			submitCandidacy(candidate_count: Compact<u32>)
			vote(votes: Vec<AccountId32>, value: Compact<u128>)
		`
	}, {
		name: "Gilt", rpc_path: "gilt",
		funcs: `
			placeBid(amount: Compact<u128>, duration: u32)
			retractBid(amount: Compact<u128>, duration: u32)
			setTarget(target: Compact<Perquintill>)
			thaw(index: Compact<u32>)
		`
	}, {
		name: "Grandpa", rpc_path: "grandpa",
		funcs: `
			noteStalled(delay: u32, best_finalized_block_number: u32)
			reportEquivocation(equivocation_proof: SpFinalityGrandpaEquivocationProof, key_owner_proof: SpSessionMembershipProof)
			reportEquivocationUnsigned(equivocation_proof: SpFinalityGrandpaEquivocationProof, key_owner_proof: SpSessionMembershipProof)
		`
	}, {
		name: "Identity", rpc_path: "identity",
		funcs: `
			addRegistrar(account: AccountId32)
			addSub(sub: MultiAddress, data: Data)
			cancelRequest(reg_index: u32)
			clearIdentity()
			killIdentity(target: MultiAddress)
			provideJudgement(reg_index: Compact<u32>, target: MultiAddress, judgement: PalletIdentityJudgement)
			quitSub()
			removeSub(sub: MultiAddress)
			renameSub(sub: MultiAddress, data: Data)
			requestJudgement(reg_index: Compact<u32>, max_fee: Compact<u128>)
			setAccountId(index: Compact<u32>, new: AccountId32)
			setFee(index: Compact<u32>, fee: Compact<u128>)
			setFields(index: Compact<u32>, fields: PalletIdentityBitFlags)
			setIdentity(info: PalletIdentityIdentityInfo)
			setSubs(subs: Vec<(AccountId32,Data)>)
		`
	}, {
		name: "ImOnline", rpc_path: "imOnline",
		funcs: `
			heartbeat(heartbeat: PalletImOnlineHeartbeat, signature: PalletImOnlineSr25519AppSr25519Signature)
		`
	}, {
		name: "Indices", rpc_path: "indices",
		funcs: `
			claim(index: u32)
			forceTransfer(new: AccountId32, index: u32, freeze: bool)
			free(index: u32)
			freeze(index: u32)
			transfer(new: AccountId32, index: u32)
		`
	}, {
		name: "Lottery", rpc_path: "lottery",
		funcs: `
			buyTicket(call: Call)
			setCalls(calls: Vec<Call>)
			startLottery(price: u128, length: u32, delay: u32, repeat: bool)
			stopRepeat()
		`
	}, {
		name: "Multisig", rpc_path: "multisig",
		funcs: `
			approveAsMulti(threshold: u16, other_signatories: Vec<AccountId32>, maybe_timepoint: Option<PalletMultisigTimepoint>, call_hash: [u8;32], max_weight: u64)
			asMulti(threshold: u16, other_signatories: Vec<AccountId32>, maybe_timepoint: Option<PalletMultisigTimepoint>, call: WrapperKeepOpaque<Call>, store_call: bool, max_weight: u64)
			asMultiThreshold1(other_signatories: Vec<AccountId32>, call: Call)
			cancelAsMulti(threshold: u16, other_signatories: Vec<AccountId32>, timepoint: PalletMultisigTimepoint, call_hash: [u8;32])
		`
	}, {
		name: "Preimage", rpc_path: "preimage",
		funcs: `
			notePreimage(bytes: Bytes)
			requestPreimage(hash: H256)
			unnotePreimage(hash: H256)
			unrequestPreimage(hash: H256)
		`
	}, {
		name: "Proxy", rpc_path: "proxy",
		funcs: `
			addProxy(delegate: AccountId32, proxy_type: NodeRuntimeProxyType, delay: u32)
			announce(real: AccountId32, call_hash: H256)
			anonymous(proxy_type: NodeRuntimeProxyType, delay: u32, index: u16)
			killAnonymous(spawner: AccountId32, proxy_type: NodeRuntimeProxyType, index: u16, height: Compact<u32>, ext_index: Compact<u32>)
			proxy(real: AccountId32, force_proxy_type: Option<NodeRuntimeProxyType>, call: Call)
			proxyAnnounced(delegate: AccountId32, real: AccountId32, force_proxy_type: Option<NodeRuntimeProxyType>, call: Call)
			rejectAnnouncement(delegate: AccountId32, call_hash: H256)
			removeAnnouncement(real: AccountId32, call_hash: H256)
			removeProxies()
			removeProxy(delegate: AccountId32, proxy_type: NodeRuntimeProxyType, delay: u32)
		`
	}, {
		name: "Recovery", rpc_path: "recovery",
		funcs: `
			asRecovered(account: AccountId32, call: Call)
			cancelRecovered(account: AccountId32)
			claimRecovery(account: AccountId32)
			closeRecovery(rescuer: AccountId32)
			createRecovery(friends: Vec<AccountId32>, threshold: u16, delay_period: u32)
			initiateRecovery(account: AccountId32)
			removeRecovery()
			setRecovered(lost: AccountId32, rescuer: AccountId32)
			vouchRecovery(lost: AccountId32, rescuer: AccountId32)
		`
	}, {
		name: "Scheduler", rpc_path: "scheduler",
		funcs: `
			cancel(when: u32, index: u32)
			cancelNamed(id: Bytes)
			schedule(when: u32, maybe_periodic: Option<(u32,u32)>, priority: u8, call: FrameSupportScheduleMaybeHashed)
			scheduleAfter(after: u32, maybe_periodic: Option<(u32,u32)>, priority: u8, call: FrameSupportScheduleMaybeHashed)
			scheduleNamed(id: Bytes, when: u32, maybe_periodic: Option<(u32,u32)>, priority: u8, call: FrameSupportScheduleMaybeHashed)
			scheduleNamedAfter(id: Bytes, after: u32, maybe_periodic: Option<(u32,u32)>, priority: u8, call: FrameSupportScheduleMaybeHashed)
		`
	}, {
		name: "Session", rpc_path: "session",
		funcs: `
			purgeKeys()
			setKeys(keys: NodeRuntimeSessionKeys, proof: Bytes)
		`
	}, {
		name: "Society", rpc_path: "society",
		funcs: `
			bid(value: u128)
			defenderVote(approve: bool)
			found(founder: AccountId32, max_members: u32, rules: Bytes)
			judgeSuspendedCandidate(who: AccountId32, judgement: PalletSocietyJudgement)
			judgeSuspendedMember(who: AccountId32, forgive: bool)
			payout()
			setMaxMembers(max: u32)
			unbid(pos: u32)
			unfound()
			unvouch(pos: u32)
			vote(candidate: MultiAddress, approve: bool)
			vouch(who: AccountId32, value: u128, tip: u128)
		`
	}, {
		name: "Staking", rpc_path: "staking",
		funcs: `
			bond(controller: MultiAddress, value: Compact<u128>, payee: PalletStakingRewardDestination)
			bondExtra(max_additional: Compact<u128>)
			cancelDeferredSlash(era: u32, slash_indices: Vec<u32>)
			chill()
			chillOther(controller: AccountId32)
			forceNewEra()
			forceNewEraAlways()
			forceNoEras()
			forceUnstake(stash: AccountId32, num_slashing_spans: u32)
			increaseValidatorCount(additional: Compact<u32>)
			kick(who: Vec<MultiAddress>)
			nominate(targets: Vec<MultiAddress>)
			payoutStakers(validator_stash: AccountId32, era: u32)
			reapStash(stash: AccountId32, num_slashing_spans: u32)
			rebond(value: Compact<u128>)
			scaleValidatorCount(factor: Percent)
			setController(controller: MultiAddress)
			setHistoryDepth(new_history_depth: Compact<u32>, era_items_deleted: Compact<u32>)
			setInvulnerables(invulnerables: Vec<AccountId32>)
			setPayee(payee: PalletStakingRewardDestination)
			setStakingConfigs(min_nominator_bond: u128, min_validator_bond: u128, max_nominator_count: Option<u32>, max_validator_count: Option<u32>, chill_threshold: Option<Percent>, min_commission: Perbill)
			setValidatorCount(new: Compact<u32>)
			unbond(value: Compact<u128>)
			validate(prefs: PalletStakingValidatorPrefs)
			withdrawUnbonded(num_slashing_spans: u32)
		`
	}, {
		name: "Sudo", rpc_path: "sudo",
		funcs: `
			setKey(new: MultiAddress)
			sudo(call: Call)
			sudoAs(who: MultiAddress, call: Call)
			sudoUncheckedWeight(call: Call, weight: u64)
		`
	}, {
		name: "System", rpc_path: "system",
		funcs: `
			fillBlock(ratio: Perbill)
			killPrefix(prefix: Bytes, subkeys: u32)
			killStorage(keys: Vec<Bytes>)
			remark(remark: Bytes)
			remarkWithEvent(remark: Bytes)
			setCode(code: Bytes)
			setCodeWithoutChecks(code: Bytes)
			setHeapPages(pages: u64)
			setStorage(items: Vec<(Bytes,Bytes)>)
		`
	}, {
		name: "TechnicalCommittee", rpc_path: "technicalCommittee",
		funcs: `
			close(proposal_hash: H256, index: Compact<u32>, proposal_weight_bound: Compact<u64>, length_bound: Compact<u32>)
			disapproveProposal(proposal_hash: H256)
			execute(proposal: Call, length_bound: Compact<u32>)
			propose(threshold: Compact<u32>, proposal: Call, length_bound: Compact<u32>)
			setMembers(new_members: Vec<AccountId32>, prime: Option<AccountId32>, old_count: u32)
			vote(proposal: H256, index: Compact<u32>, approve: bool)
		`
	}, {
		name: "TechnicalMembership", rpc_path: "technicalMembership",
		funcs: `
			addMember(who: AccountId32)
			changeKey(new: AccountId32)
			clearPrime()
			removeMember(who: AccountId32)
			resetMembers(members: Vec<AccountId32>)
			setPrime(who: AccountId32)
			swapMember(remove: AccountId32, add: AccountId32)
		`
	}, {
		name: "Timestamp", rpc_path: "timestamp",
		funcs: `
			set(now: Compact<u64>)
		`
	}, {
		name: "Tips", rpc_path: "tips",
		funcs: `
			closeTip(hash: H256)
			reportAwesome(reason: Bytes, who: AccountId32)
			retractTip(hash: H256)
			slashTip(hash: H256)
			tip(hash: H256, tip_value: Compact<u128>)
			tipNew(reason: Bytes, who: AccountId32, tip_value: Compact<u128>)
		`
	}, {
		name: "TransactionStorage", rpc_path: "transactionStorage",
		funcs: `
			checkProof(proof: SpTransactionStorageProofTransactionStorageProof)
			renew(block: u32, index: u32)
			store(data: Bytes)
		`
	}, {
		name: "Treasury", rpc_path: "treasury",
		funcs: `
			approveProposal(proposal_id: Compact<u32>)
			proposeSpend(value: Compact<u128>, beneficiary: MultiAddress)
			rejectProposal(proposal_id: Compact<u32>)
		`
	}, {
		name: "Uniques", rpc_path: "uniques",
		funcs: `
			approveTransfer(class: Compact<u32>, instance: Compact<u32>, delegate: MultiAddress)
			burn(class: Compact<u32>, instance: Compact<u32>, check_owner: Option<MultiAddress>)
			cancelApproval(class: Compact<u32>, instance: Compact<u32>, maybe_check_delegate: Option<MultiAddress>)
			clearAttribute(class: Compact<u32>, maybe_instance: Option<u32>, key: Bytes)
			clearClassMetadata(class: Compact<u32>)
			clearMetadata(class: Compact<u32>, instance: Compact<u32>)
			create(class: Compact<u32>, admin: MultiAddress)
			destroy(class: Compact<u32>, witness: PalletUniquesDestroyWitness)
			forceAssetStatus(class: Compact<u32>, owner: MultiAddress, issuer: MultiAddress, admin: MultiAddress, freezer: MultiAddress, free_holding: bool, is_frozen: bool)
			forceCreate(class: Compact<u32>, owner: MultiAddress, free_holding: bool)
			freeze(class: Compact<u32>, instance: Compact<u32>)
			freezeClass(class: Compact<u32>)
			mint(class: Compact<u32>, instance: Compact<u32>, owner: MultiAddress)
			redeposit(class: Compact<u32>, instances: Vec<u32>)
			setAttribute(class: Compact<u32>, maybe_instance: Option<u32>, key: Bytes, value: Bytes)
			setClassMetadata(class: Compact<u32>, data: Bytes, is_frozen: bool)
			setMetadata(class: Compact<u32>, instance: Compact<u32>, data: Bytes, is_frozen: bool)
			setTeam(class: Compact<u32>, issuer: MultiAddress, admin: MultiAddress, freezer: MultiAddress)
			thaw(class: Compact<u32>, instance: Compact<u32>)
			thawClass(class: Compact<u32>)
			transfer(class: Compact<u32>, instance: Compact<u32>, dest: MultiAddress)
			transferOwnership(class: Compact<u32>, owner: MultiAddress)
		`
	}, {
		name: "Utility", rpc_path: "utility",
		funcs: `
			asDerivative(index: u16, call: Call)
			batch(calls: Vec<Call>)
			batchAll(calls: Vec<Call>)
			dispatchAs(as_origin: NodeRuntimeOriginCaller, call: Call)
		`
	}, {
		name: "Vesting", rpc_path: "vesting",
		funcs: `
			forceVestedTransfer(source: MultiAddress, target: MultiAddress, schedule: PalletVestingVestingInfo)
			mergeSchedules(schedule1_index: u32, schedule2_index: u32)
			vest()
			vestOther(target: MultiAddress)
			vestedTransfer(target: MultiAddress, schedule: PalletVestingVestingInfo)
		`
	}
]);