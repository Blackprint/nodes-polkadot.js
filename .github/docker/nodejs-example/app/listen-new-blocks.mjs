// Run this from your terminal:
// node listen-new-blocks.mjs

import Blackprint from "@blackprint/engine";
import "@blackprint/nodes-polkadot.js/dist/nodes-polkadotjs.mjs";

// Surpress some warning from @polkadot/util
let warn = console.warn;
console.warn = function(msgA){
	if(msgA.includes(' has multiple versions, ensure that there is only one installed')) return;
	warn.apply(console, arguments);
}

// Wait until the module context was registered
await Blackprint.getContext('Polkadot.js');

// Create the instance and import the JSON
let MyInstance = new Blackprint.Engine();
await MyInstance.importJSON(`{"Polkadot.js/Connection/WebSocket":[{"i":0,"x":0,"y":0,"z":0,"id":"websocketNode","data":{"rpcURL":""},"output":{"API":[{"i":1,"name":"API"}]}}],"Polkadot.js/Events/Blocks":[{"i":1,"x":364,"y":19,"z":1,"id":"blocksNode"}]}`);

// Obtain our node reference
let { websocketNode, blocksNode } = MyInstance.iface;

// Change RPC URL
console.log("Connecting...");
websocketNode.data.rpcURL = "wss://westend-rpc.polkadot.io";

// Listen for RPC connection status change
websocketNode.ref.IOutput.Connected.on('call', () => {
	console.log(`RPC Connected!`);

	if(websocketNode.ref.Output.API == null){
		console.log("Waiting RPC response...");
	}
});
websocketNode.ref.IOutput.Disconnected.on('call', () => console.log(`RPC Disconnected!`));

// Note: usually Polkadot.js will take some time to initialize the API
websocketNode.ref.IOutput.API.once('value', () => console.log(`API Initialized!`));

// Listen to new blocks number from the blocksNode's output port
blocksNode.ref.IOutput.Number.on('value', function({ port }){
	console.log(`Current blocks number: ${ port.value }`);
});