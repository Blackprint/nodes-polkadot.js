/**
 * import { Context, Signer } from "../_init.js";
 * import { NodeToast } from "../utils/NodeToast.js";
 * { polkadotUtil } = window
 */


/**
 * Sign a data with wallet's signer (private key)
 * The signed data can then be verified with the signer's wallet address (public key)
 * @blackprint node
 * @summary Sign a data
 */
Blackprint.registerNode("Polkadot.js/Data/Sign",
class SignNode extends Blackprint.Node {
	// Input port
	static input = {
		/** Start the signing process (trigger is required to ask access to browser wallet) */
		Trigger: Blackprint.Port.Trigger(function({ iface }){
			iface.node.trigger();
		}),
		/** Keypair's signer or browser extension's signer */
		Signer: Signer,
		/** Any data to be signed */
		Data: Blackprint.Port.Union([String, Uint8Array]),
	};

	// Output port
	static output = {
		/** Data's signature */
		Bytes: Uint8Array
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface(); // use empty interface
		iface.title = "Sign";
		iface.description = "Data/transaction signer";

		this._toast = new NodeToast(this.iface);

		// Manually call 'update' when any cable from input port was disconnected
		this.iface.on('cable.disconnect', Context.EventSlot, ({ port })=> {
			if(port.source === 'input') this.update();
		});
	}

	_fail(msg){
		this.output.Bytes = null; // Clear the output data if something was fail/error
		this._toast.warn(msg);
	}

	// This will be called by the engine if the input port have a new value
	update(){
		let { Input, Output } = this.ref; // Shortcut

		if(!Input.Signer)
			return this._fail("Signer is required");

		let data = Input.Data;
		if(!data)
			return this._fail("Data is required");

		this._toast.clear();
	}

	async trigger(){
		let { Input, Output } = this.ref; // Shortcut

		if(!Input.Signer || !Input.Data)
			return this._fail("Some input is required");

		let data = Input.Data;
		let { signer, address, isPair } = Input.Signer;

		Output.Bytes = null;

		// There's 2 source of Signer (from Keypair and Browser Extension)
		if(isPair){ // Signer from Keypair (polkadotApi.Keyring)
			if(data.constructor === String)
				data = polkadotUtil.stringToU8a(data);

			// Sign with the keypair and put the data to the output port
			Output.Bytes = signer.sign(data);
		}
		else { // Signer from extension (polkadotExtensionDapp)
			if(data.constructor === Uint8Array)
				data = polkadotUtil.u8aToHex(data);
			else if(data.slice(0, 2) !== '0x')
				data = polkadotUtil.stringToHex(data);

			// Sign with the extension and get the Hex
			try{
				var temp = signer.signRaw({
					type: 'bytes',
					data,
					address,
				});

				// Store the promise to iface
				this.iface.signing = temp;
				temp = await temp;
				
				this.iface.signing = false;
			} catch(e) {
				this._fail(e.message);
				throw e;
			}

			// Convert the returned Hex to Uint8Array and put the data to the output port
			Output.Bytes = polkadotUtil.hexToU8a(temp.signature);
		}
	}
});