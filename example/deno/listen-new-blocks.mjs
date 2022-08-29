// Run this from your terminal:
// deno run --allow-net listen-new-blocks.mjs

import Blackprint from 'https://cdn.skypack.dev/@blackprint/engine@0.7';
import "https://cdn.jsdelivr.net/npm/@blackprint/nodes-polkadot.js@0.5/dist/nodes-polkadotjs.mjs";

// Fix bundled version of Polkadot.js's library
globalThis.__filename = '';
globalThis.require = function(module){
	module = module.toLowerCase();

	if(module === 'url') return { URL: class{} };
	throw "Unhandled module: " + module;
};

// Wait until the module context was registered
await Blackprint.getContext('Polkadot.js');

// Create the instance and import the JSON
let MyInstance = new Blackprint.Engine();
await MyInstance.importJSON(`{"Polkadot.js/Connection/WebSocket":[{"i":0,"x":0,"y":0,"z":0,"id":"websocketNode","data":{"rpcURL":""},"output":{"API":[{"i":1,"name":"API"}]}}],"Polkadot.js/Events/Blocks":[{"i":1,"x":364,"y":19,"z":1,"id":"blocksNode"}]}`);

// Obtain our node reference
let { websocketNode, blocksNode } = MyInstance.iface;

// Change RPC URL
console.log("Connecting...");
websocketNode.data.rpcURL = "wss://ws.test.azero.dev";

// Listen for RPC connection status change
websocketNode.ref.IOutput.Connected.on('call', () => console.log(`RPC Connected!`));
websocketNode.ref.IOutput.Disconnected.on('call', () => console.log(`RPC Disconnected!`));

// Note: usually Polkadot.js will take some time to initialize the API
websocketNode.ref.IOutput.API.once('value', () => console.log(`API Initialized!`));

// Listen to new blocks number from the blocksNode's output port
blocksNode.ref.IOutput.Number.on('value', function({ port }){
	console.log(`Current blocks number: ${ port.value }`);
});