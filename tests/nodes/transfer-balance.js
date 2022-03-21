/**
 * 'MyInstance' is instance of:
 * 1. Blackprint.Sketch if created from '../browser.test.js' - for Browser environment
 * 2. Blackprint.Engine if created from '../node.test.js' - for Node.js environment
 */

// This test will be run after
// - tests/nodes/import-mnemonic.js

describe("Transfer balance", () => {
	let WS_RPC;

	// Wallet address
	let Port_AddressA = new Blackprint.OutputPort(String);
	let Port_AddressB = new Blackprint.OutputPort(String);
	Port_AddressA.value = process.env.WALLET_ADDRESS_A; // 1KczAVb5pokkvsKoX8eEwxVnmwq8wNo9jgYDm4sHR9Z9nNQ
	Port_AddressB.value = process.env.WALLET_ADDRESS_B; // 1a1Uk5MqRZnKAgu3E3EZCU33Pg59gFgVC5SavkYKWs3au7k

	test("Prepare connection to Westend network", (done) => {
		// Create WebSocket node
		WS_RPC = MyInstance.createNode('Polkadot.js/Connection/WebSocket', {id: 'WS_RPC'});
		expect(MyInstance.iface.WS_RPC).toBeDefined();

		// This output port will have value after connected to the network and ready to be used
		WS_RPC.output.API.once('value', v=> done());

		// Changing the RPC URL will trigger reconnection
		WS_RPC.data.rpcURL = 'wss://westend-rpc.polkadot.io/';
	});

	let Port_SendValue = new Blackprint.OutputPort(Number);
	Port_SendValue.value = 0.01e12; // 0.01 WND

	let Port_SendValue2 = new Blackprint.OutputPort(Number);
	Port_SendValue2.value = 0.015e12; // 0.015 WND

	let Port_SendBigValue = new Blackprint.OutputPort(Number);
	Port_SendBigValue.value = 999e12; // 999 WND

	test("Prepare transaction for sending 0.01, 0.015, and 999 WND", () => {
		// Create transfer balance node
		let Tx_To_WalletB = MyInstance.createNode('Polkadot.js/Account/Transfer/Balance', {id: 'Tx_To_WalletB'});
		Tx_To_WalletB.input.API.connectPort(WS_RPC.output.API);
		Tx_To_WalletB.input.Address.connectPort(Port_AddressB); // process.env.WALLET_ADDRESS_B
		Tx_To_WalletB.input.Value.connectPort(Port_SendValue); // 0.01e12
		expect(Tx_To_WalletB.ref.Output.Txn).toBeDefined();

		// Create another transfer balance node for testing batch feature
		let Tx2_To_WalletB = MyInstance.createNode('Polkadot.js/Account/Transfer/Balance', {id: 'Tx2_To_WalletB'});
		Tx2_To_WalletB.input.API.connectPort(WS_RPC.output.API);
		Tx2_To_WalletB.input.Address.connectPort(Port_AddressB); // process.env.WALLET_ADDRESS_B
		Tx2_To_WalletB.input.Value.connectPort(Port_SendValue2); // 0.015e12
		expect(Tx2_To_WalletB.ref.Output.Txn).toBeDefined();

		// Create transfer of insufficient balance
		let BigTx_To_WalletB = MyInstance.createNode('Polkadot.js/Account/Transfer/Balance', {id: 'BigTx_To_WalletB'});
		BigTx_To_WalletB.input.API.connectPort(WS_RPC.output.API);
		BigTx_To_WalletB.input.Address.connectPort(Port_AddressB); // process.env.WALLET_ADDRESS_B
		BigTx_To_WalletB.input.Value.connectPort(Port_SendBigValue); // 999 WND
		expect(BigTx_To_WalletB.ref.Output.Txn).toBeDefined();

		// Make sure the node is accessible from the interface
		expect(MyInstance.iface.Tx_To_WalletB).toBeDefined();
		expect(MyInstance.iface.Tx2_To_WalletB).toBeDefined();
		expect(MyInstance.iface.BigTx_To_WalletB).toBeDefined();
	});

	test("Obtain payment info for the transaction", (done) => {
		let { Tx_To_WalletB, Keypair_Node_A } = MyInstance.iface;

		// Create transfer balance node
		let PaymentInfo = MyInstance.createNode('Polkadot.js/Transaction/PaymentInfo');
		PaymentInfo.input.Txn.connectPort(Tx_To_WalletB.output.Txn);
		PaymentInfo.input.Sender.connectPort(Keypair_Node_A.output.Address);

		PaymentInfo.output.Info.on('value', ev => {
			// At least not zero or undefined
			expect(ev.port.value.partialFee.toNumber()).toBeGreaterThan(0);

			// Remove node
			MyInstance.deleteNode(PaymentInfo);
			done();
		});
	});

	test("Submit transaction and listen for balance changes", (done) => {
		// Use signer from 'tests/nodes/import-mnemonic.js'
		let { Keypair_Node_A, Tx_To_WalletB } = MyInstance.iface;

		// Create send transaction node
		let SendTx = MyInstance.createNode('Polkadot.js/Transaction/Send');
		SendTx.input.Txn.connectPort(Tx_To_WalletB.output.Txn);
		SendTx.input.Signer.connectPort(Keypair_Node_A.output.Signer);

		let BalanceA, BalanceB;
		let ChangedBalanceA, ChangedBalanceB;
		
		// Create balance listener node
		let Balance_WalletA = MyInstance.createNode('Polkadot.js/Events/Account/Balance');
		let Balance_WalletB = MyInstance.createNode('Polkadot.js/Events/Account/Balance');

		Balance_WalletA.input.API.connectPort(WS_RPC.output.API);
		Balance_WalletA.input.Address.connectPort(Port_AddressA);

		Balance_WalletB.input.API.connectPort(WS_RPC.output.API);
		Balance_WalletB.input.Address.connectPort(Port_AddressB);

		function afterObtainingFirstBalances(){
			if(BalanceA == null || BalanceB == null)
				return; // We still need to wait for the seconds wallet

			// All account balance was obtained let's submit our prepared transaction
			// for transferring balance

			// Short delay, to avoid spamming the testnet
			setTimeout(() => {
				SendTx.ref.Input.Submit();
			}, 2000);

			// Wait until finalized
			SendTx.output.Success.on('call', ev => {
				if(ChangedBalanceA == null)
					return done(new Error("Wallet A is expected to have balance changes due to transaction fee, but it seems he was unchanged from: " + BalanceA));

				expect(ChangedBalanceB).toBe(Port_SendValue.value); // expect the wallet B to receive 0.01 WND (0.01e12)
				expect(SendTx.ref.Output.Status).toBeDefined();
				expect(SendTx.ref.Output.TxHash).toBeDefined();

				// Delete node
				MyInstance.deleteNode(SendTx);
				MyInstance.deleteNode(Balance_WalletA);
				MyInstance.deleteNode(Balance_WalletB);
				return done();
			});

			// Throw when error
			SendTx.output.Failed.on('call', ev => {
				MyInstance.deleteNode(SendTx);
				MyInstance.deleteNode(Balance_WalletA);
				MyInstance.deleteNode(Balance_WalletB);

				done(new Error("Failed to send balance"));
			});
		}

		// The second event can be used for displaying account's current balance
		let skipOnceA;
		Balance_WalletA.output.Data.on('value', ({ port: { value } }) => {
			let balance = Number(value.data.free);
			if(Number(value.nonce) === 0 && !skipOnceA) return skipOnceA = true;

			if(BalanceA == null){ // Save account's current balance on the first event
				BalanceA = balance;
				afterObtainingFirstBalances();
			} else { // When the account balance was changed after we submit the transaction
				ChangedBalanceA = balance - BalanceA;
			}
		});

		let skipOnceB;
		Balance_WalletB.output.Data.on('value', ({ port: { value } }) => {
			if(Number(value.nonce) === 0 && !skipOnceB) return skipOnceB = true;
			let balance = Number(value.data.free);

			if(BalanceB == null){ // Save account's current balance on the first event
				BalanceB = balance;
				afterObtainingFirstBalances();
			} else { // When the account balance was changed after we submit the transaction
				ChangedBalanceB = balance - BalanceB;
			}
		});
	});

	test("Submit batch transaction and listen for balance changes", (done) => {
		// Use signer from 'tests/nodes/import-mnemonic.js'
		let { Keypair_Node_A, Tx_To_WalletB, Tx2_To_WalletB } = MyInstance.iface;

		let BatchTx = MyInstance.createNode('Polkadot.js/Transaction/Batch');
		Tx_To_WalletB.output.Txn.connectPort(BatchTx.input.Txn);  // Sufficient balance Tx   (0.01 WND)
		Tx2_To_WalletB.output.Txn.connectPort(BatchTx.input.Txn); // Sufficient balance Tx   (0.015 WND)
		expect(BatchTx.input.Txn.cables.length).toBe(2);
		expect(BatchTx.ref.Output.Txn).toBeDefined();

		// Create send transaction node
		let SendTx = MyInstance.createNode('Polkadot.js/Transaction/Send');
		SendTx.input.Txn.connectPort(BatchTx.output.Txn);
		SendTx.input.Signer.connectPort(Keypair_Node_A.output.Signer);

		let BalanceA, BalanceB;
		let ChangedBalanceA, ChangedBalanceB;

		// Create balance listener node
		let Balance_WalletA = MyInstance.createNode('Polkadot.js/Events/Account/Balance');
		let Balance_WalletB = MyInstance.createNode('Polkadot.js/Events/Account/Balance');

		Balance_WalletA.input.API.connectPort(WS_RPC.output.API);
		Balance_WalletA.input.Address.connectPort(Port_AddressA);

		Balance_WalletB.input.API.connectPort(WS_RPC.output.API);
		Balance_WalletB.input.Address.connectPort(Port_AddressB);

		function afterObtainingFirstBalances(){
			if(BalanceA == null || BalanceB == null)
				return; // We still need to wait for the seconds wallet

			// All account balance was obtained let's submit our prepared transaction
			// for transferring balance

			// Short delay, to avoid spamming the testnet
			setTimeout(() => {
				SendTx.ref.Input.Submit();
			}, 2000);

			// Wait until finalized
			SendTx.output.Success.on('call', ev => {
				if(ChangedBalanceA == null)
					return done(new Error("Wallet A is expected to have balance changes due to transaction fee, but it seems he was unchanged from: " + BalanceA));

				// expect the wallet B to receive 0.01 WND + 0.015 WND = 0.025 WND
				expect(ChangedBalanceB).toBe(Port_SendValue.value + Port_SendValue2.value);
				expect(SendTx.ref.Output.Status).toBeDefined();
				expect(SendTx.ref.Output.TxHash).toBeDefined();

				MyInstance.deleteNode(SendTx);
				MyInstance.deleteNode(BatchTx);
				MyInstance.deleteNode(Balance_WalletA);
				MyInstance.deleteNode(Balance_WalletB);
				return done();
			});

			// Throw when error
			SendTx.output.Failed.on('call', ev => {
				MyInstance.deleteNode(SendTx);
				MyInstance.deleteNode(BatchTx);
				MyInstance.deleteNode(Balance_WalletA);
				MyInstance.deleteNode(Balance_WalletB);

				done(new Error("Failed to send balance"));
			});
		}

		// The second event can be used for displaying account's current balance
		let skipOnceA;
		Balance_WalletA.output.Data.on('value', ({ port: { value } }) => {
			let balance = Number(value.data.free);
			if(Number(value.nonce) === 0 && !skipOnceA) return skipOnceA = true;

			if(BalanceA == null){ // Save account's current balance on the first event
				BalanceA = balance;
				afterObtainingFirstBalances();
			} else { // When the account balance was changed after we submit the transaction
				ChangedBalanceA = balance - BalanceA;
			}
		});

		let skipOnceB;
		Balance_WalletB.output.Data.on('value', ({ port: { value } }) => {
			let balance = Number(value.data.free);
			if(Number(value.nonce) === 0 && !skipOnceB) return skipOnceB = true;

			if(BalanceB == null){ // Save account's current balance on the first event
				BalanceB = balance;
				afterObtainingFirstBalances();
			} else { // When the account balance was changed after we submit the transaction
				ChangedBalanceB = balance - BalanceB;
			}
		});
	});

	test("Fail on insufficient balance", (done) => {
		let { Keypair_Node_A, BigTx_To_WalletB } = MyInstance.iface;

		// Create send transaction node
		let SendTx = MyInstance.createNode('Polkadot.js/Transaction/Send');
		SendTx.input.Txn.connectPort(BigTx_To_WalletB.output.Txn);
		SendTx.input.Signer.connectPort(Keypair_Node_A.output.Signer);

		// All account balance was obtained let's submit our prepared transaction
		// for transferring balance

		// Short delay, to avoid spamming the testnet
		setTimeout(() => {
			SendTx.ref.Input.Submit();
		}, 2000);

		// We expect the transaction will failed
		SendTx.output.Failed.on('call', ev => {
			expect(SendTx.ref.Output.Status).toBeDefined();
			expect(SendTx.ref.Output.TxHash).toBeDefined();

			// Delete node
			MyInstance.deleteNode(SendTx);
			return done();
		});

		// Fail if not failed
		SendTx.output.Success.on('call', ev => {
			done(new Error("The test must be failed because insufficient wallet balance, but it was success"));
		});
	});

	test("Batch fail on insufficient balance", (done) => {
		let { Keypair_Node_A, Tx_To_WalletB, BigTx_To_WalletB } = MyInstance.iface;

		let BatchTx = MyInstance.createNode('Polkadot.js/Transaction/Batch');
		Tx_To_WalletB.output.Txn.connectPort(BatchTx.input.Txn);    // Sufficient balance Tx   (0.01 WND)
		BigTx_To_WalletB.output.Txn.connectPort(BatchTx.input.Txn); // Insufficient balance Tx (999 WND)

		// Create send transaction node
		let SendTx = MyInstance.createNode('Polkadot.js/Transaction/Send');
		SendTx.input.Txn.connectPort(BatchTx.output.Txn);
		SendTx.input.Signer.connectPort(Keypair_Node_A.output.Signer);

		// All account balance was obtained let's submit our prepared transaction
		// for transferring balance
		
		// Short delay, to avoid spamming the testnet
		setTimeout(() => {
			SendTx.ref.Input.Submit();
		}, 2000);

		// We expect the transaction will failed
		SendTx.output.Failed.on('call', ev => {
			// Status and TxHash will always defined even it was failed
			expect(SendTx.ref.Output.Status).toBeDefined();
			expect(SendTx.ref.Output.TxHash).toBeDefined();

			// Delete node
			MyInstance.deleteNode(SendTx);
			MyInstance.deleteNode(BatchTx);
			return done();
		});

		// Error if not failed
		SendTx.output.Success.on('call', ev => {
			// Delete node
			MyInstance.deleteNode(SendTx);
			MyInstance.deleteNode(BatchTx);
			done(new Error("The test must be failed because insufficient wallet balance, but it was success"));
		});
	});
});