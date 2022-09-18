let { injectExtension } = require("@polkadot/extension-inject");

injectExtension(async (originName) => {
	console.log(`${originName}: is asking for permission to access browser extension`);
	// Let's just allow it and give wallet address from current environment and create custom signer

	var keyring = new polkadotApi.Keyring({
		type: 'ed25519',
		ss58Format: 0,
	});

	let keypair = {
		[process.env.WALLET_ADDRESS_A]: keyring.addFromMnemonic(process.env.MNEMONIC_A),
		[process.env.WALLET_ADDRESS_B]: keyring.addFromMnemonic(process.env.MNEMONIC_B),
	};
	
	// Injected account
	let accounts = [
		{name: 'TestWalletA', type: 'ed25519', address: process.env.WALLET_ADDRESS_A},
		{name: 'TestWalletB', type: 'ed25519', address: process.env.WALLET_ADDRESS_B},
	];

	// Types: https://github.com/polkadot-js/extension/blob/6ff6073d6a3cfb546bcc29c1b621f540414182f7/packages/extension-inject/src/types.ts#L94-L99
	return {
		accounts: {
			async get(){ return accounts.slice(0) },
			async subscribe(){}, // Do nothing for now
		},

		// https://github.com/polkadot-js/api/blob/2f28ea0ea8f3571631882077926edfbc9c45248d/packages/types/src/types/extrinsic.ts#L135
		signer: {
			async signPayload(){ throw new Error("signer.signPayload is not implemented") },
			async signRaw({ data, address }){
				let pair = keypair[address];
				if(pair == null)
					throw new Error(`Can't find keypair with address: ${address}`);

				return {
					id: Math.random()*1000 | 0,
					signature: polkadotUtil.u8aToHex(pair.sign(data)),
				};
			},
			update(){ throw new Error("signer.update is not implemented") },
		}
	};
}, { name: 'polkadot-js', version: '0.0.1' });