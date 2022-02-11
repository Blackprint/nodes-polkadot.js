[![NPM](https://img.shields.io/npm/v/@blackprint/nodes-polkadot.js.svg)](https://www.npmjs.com/package/@blackprint/nodes-polkadot.js)
[![Build Status](https://github.com/Blackprint/nodes-polkadot.js/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/Blackprint/nodes-polkadot.js/actions/workflows/build.yml)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FBlackprint%2Fnodes-polkadot.js.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FBlackprint%2Fnodes-polkadot.js?ref=badge_shield)

## Polkadot.js integration for Blackprint

### Examples
If you want to just try using Blackprint with this nodes you can use the example below.
> The links may get outdated, and if it's not working, please import the JSON instead

<details>
	<summary>Listening to new block (JSON)</summary>

Open [this example](https://blackprint.github.io/dev.html#page/sketch/1#;importSketch:rZJbi9swEIX_itBrXSkX26R-2jbtQ0tYluyWUpawKJJwHMsaY8nJpsH_vWMn7jp7gRb6JKQZnfPNkY70gSZHWoCqjf52S5N7uvG-dAnnUlm2dUqbbFcxqz23ZcGv1kbIvKwyi3tQ2r0vweRCgcfeqxEbc5W556WtY8XW0eAfpVFuOpSTYB0Y_V-0lJZQCZ-BZUVmO8lVE9Cbp2H4HKzVsm3hP_T6FmSuPeZzpBlNRgF9pEk0CegBl3FAJRSFtliniKaEF22qVSm_Lxd4tnctKW6Z22Tr-iCYcF50uHuocorOUPuy9u2tjzdfe5swoFYUGhXaw2bVNEF3Ph7aT8Lw7_z3jnntPBO_dAVM6d2bvtEL31VA56f4-QLSvm_SccRR3IGMo9kFyBl2em4KT7Tx5LJpdZn6lx0WHP9kMG83yAElwtHJJ_7wbN6nGa7rYq2rAV4_hj0M4ovOcrNXid7Wm77QQ_jPf34Sv9OPnl8DhtzfiM-zz14H7x9qJ0zdyv6EmkhhiTAOyPxuuSDvyDJLN55Ik8mcAJZICZUnHkiqPXF1muKTakXab00RqPkN) on Blackprint Editor.

If you import with this JSON on Blackprint Editor.
```json
{"_":{"moduleJS":["https://cdn.jsdelivr.net/npm/@blackprint/nodes-polkadot.js@0.1/dist/nodes-polkadotjs.mjs","https://cdn.jsdelivr.net/npm/@blackprint/nodes@0.3/dist/nodes-console.mjs","https://cdn.jsdelivr.net/npm/@blackprint/nodes@0.3/dist/nodes-decoration.mjs"]},"Polkadot.js/Connection/WebSocket":[{"i":0,"x":52,"y":51,"data":{"rpcURL":"wss://rpc.shibuya.astar.network"},"output":{"API":[{"i":2,"name":"API"}]}},{"i":4,"x":52,"y":244,"data":{"rpcURL":"wss://ws.test.azero.dev"},"output":{"API":[{"i":5,"name":"API"}]}}],"Console/Log":[{"i":1,"x":656,"y":158},{"i":6,"x":654,"y":262}],"Polkadot.js/Events/Blocks":[{"i":2,"x":406,"y":69,"output":{"Number":[{"i":1,"name":"Any"}]}},{"i":5,"x":408,"y":262,"output":{"Number":[{"i":6,"name":"Any"}]}}],"Decoration/Text/Notes":[{"i":3,"x":658,"y":69,"data":{"value":"You can also CTRL + Right click on a port to get suggested node"}}]}
```
</details>

<details>
	<summary>Do a transaction (JSON)</summary>

Open [this example](https://blackprint.github.io/dev.html#page/sketch/1#;importSketch:pVZrb9o8FP4rkb9sk1KSQBIu0qTRl1dbWVVlhdHLVE0mdiEQ7Ch2AmnFf58dB3Ba2PUb8Tl-zu15jnkG30HvGawoymI8HIHeNzDnPGE9ywoRaSwYwnGUpw2CuUWSlfVhGsNwmaQREd8UYfbBbrQsFLHq8ywiScYbqwUD5j8ihZQwGuO_wjpLaLyEiHLhK3AdHXdnWrAS-mFrgguZtDXGG35ON6IHzyACPdsE4rfjtE1QgF6r3TFBSFcrTDjoAQc7TeO94Rij8zuRHYIcyj7mMM5wZQYCmGZcIEvLRFkUdNMEBK6kozrePmy3ZmlpqaB2swzabNaCHgl0z-Zj33tCKHcvL-_7nS6dOMPbgOST6Gk8oIVf4PGw601zfnvFJ_5v5dRHKMWMaVl5ZVbdTpmU16oldUczYx3FsUEwRkY4h2SGDT6PmAEVjrDyuVHQLN2fPNLUGM2jaVZAq884TA2OGRfTPFIhzJd3xXBAs-vJPKDhLAk_BpNW_9NkAPFw0WJs4g8Wd7dXwc3T5sv94CcV-kcrfDDBf4pp1iWd7XwdVbGrhu_Zdm0OVVscp5qW1y3dHNutuwns4EBEqx-GNBMUHaeQsEecaq0XMK5nK5Ru88XQD_WMN2R3qbOvRh6aIIGpuHCBBHF36dknXZytpP33EE5jrOOKNHxPjbnpiuqmItNwrkLukav7qnd6fZ9xISQ4swbZalXs8nTL4nxfFeedLG0UzcihJYfqqvMj4f7fcExYRIlVv-urdroqott2fzOm1q_TQQVXCA65jHqDpyMaLgVrK4B2GbjtlXFfhd0RO03Cr9eX4mzN5EITnw2mtNCAUgtyq61puqwzOUhpHqFjDdpbfsGBo36OrK8fXOx7oK0BcXoM8rTHS1bVcpYkaCtqOa73C2odcpKTlDqT13z3TxlZKg2qcQWwkMO4II9Ua6LA77i-wnfsk0zRb8l0dh0gxcsl8hHzayzEjUm43zxdtU08VymrU1ugA8ELtUGn2IjpbCbWKCXGNKVrhtM3zKgeQuPtAOdjSmP27tVm0escYYJ0SktKOn6l6ZfviaYFDnnGtIxfl1gTXy4wmHUeCwUwnT2l9NQ-7Px0G2pK2it5D6TewXaz0rAvoOSUQdWVGxjH5WtxVGGonyRXKvvz4EyLWZdUtY6ZtvNrNYv_Bawfx3SN0SkX0ZbtDw) on Blackprint Editor.

If you import with this JSON on Blackprint Editor.
```json
{"_":{"moduleJS":["https://cdn.jsdelivr.net/npm/@blackprint/nodes@0.3/dist/nodes-input.mjs","https://cdn.jsdelivr.net/npm/@blackprint/nodes@0.3/dist/nodes-console.mjs","https://cdn.jsdelivr.net/npm/@blackprint/nodes-polkadot.js@0.1/dist/nodes-polkadotjs.mjs"]},"Input/TextBox":[{"i":0,"x":117,"y":378,"comment":"1e12 = 1 SBY","data":{"value":"1e12"},"output":{"Value":[{"i":2,"name":"Value"}]}},{"i":3,"x":102,"y":228,"comment":"","data":{"value":"ZshT65zddv4LLZA89oV1JXPnvVizTDoy6yeTJ95bvtXNtV6"},"output":{"Value":[{"i":2,"name":"Address"}]}},{"i":5,"x":98,"y":538,"comment":"You will need change this address with your address for Shibuya/Astar testnet","data":{"value":"avkYyJDouRVhPocgpcGPV3AHVDaeJj3ssV6DjYXNPWzxQZD"},"output":{"Value":[{"i":6,"name":"Address"}]}}],"Console/Log":[{"i":1,"x":947,"y":500,"comment":""},{"i":11,"x":1059,"y":104,"comment":""}],"Polkadot.js/Account/Transfer":[{"i":2,"x":450,"y":192,"comment":"","output":{"Txn":[{"i":8,"name":"Txn","parentId":0},{"i":10,"name":"Txn","parentId":1}]},"_cable":{"Txn":[{"x":658,"y":241,"branch":[{"id":0},{"id":1}]}]}}],"Polkadot.js/Keyring/Dummy":[{"i":4,"x":660,"y":5,"comment":"","output":{"Signer":[{"i":8,"name":"Signer"}]}}],"Polkadot.js/Extension/Signer":[{"i":6,"x":440,"y":474,"comment":"","output":{"Signer":[{"i":10,"name":"Signer"}]}}],"Polkadot.js/Connection/WebSocket":[{"i":7,"x":75,"y":74,"comment":"","data":{"rpcURL":"wss://rpc.shibuya.astar.network"},"output":{"Provider":[{"i":8,"name":"Provider","parentId":0},{"i":10,"name":"Provider","parentId":1}],"API":[{"i":12,"name":"API","parentId":0},{"i":2,"name":"API","parentId":1}]},"_cable":{"Provider":[{"x":678,"y":145,"branch":[{"id":0},{"id":1}]}],"API":[{"x":411,"y":164,"branch":[{"id":0},{"id":1}]}]}}],"Polkadot.js/Transaction/PaymentInfo":[{"i":8,"x":846,"y":110,"comment":"","output":{"Info":[{"i":11,"name":"Any"}]}}],"Console/GetReference":[{"i":9,"x":954,"y":288,"comment":"Data will be logged on browser's console (DevTools)"}],"Polkadot.js/Transaction/Send":[{"i":10,"x":716,"y":248,"comment":"","output":{"Status":[{"i":9,"name":"Any"}]}}],"Polkadot.js/Events/Blocks":[{"i":12,"x":449,"y":8,"comment":""}],"Polkadot.js/Connection/Extension":[{"i":13,"x":720,"y":468,"id":"browserWallet","comment":"","data":{"dAppName":"BP-Polkadot.js"},"output":{"Accounts":[{"i":1,"name":"Any"}],"IsAllowed":[{"i":1,"name":"Any"}]}}]}
```
</details>

---

### Distributable files

All files inside `src` folder will be bundled into 3 distributable file. Some file is optional to be loaded on the target environment. For the example Node.js will only need `nodes-polkadot.mjs`, and also `nodes-polkadot.sf.css` is optional to be loaded for browser.

```js
// all .js files
- dist/nodes-polkadotjs.mjs    // For browser, Node.js, and Deno (required)

// all .sf files
- dist/nodes-polkadotjs.sf.mjs // For browser only (required)
- dist/nodes-polkadotjs.sf.css // For browser only (optional)
```

## Directory structure
With this structure you can easily find the source code where the node belongs to.<br>
All files will be bundled and variables declared on this library will not automatically declared on the global context.

Configuration file can be changed from `./blackprint.config.js`.<br>
The `src` directory structure is arranged like below:

| File path | Blackprint Node path |
|---|---|
| `./src/Account/Transfer.js`| `Polkadot.js/Account/Transfer` |
| `./src/Connection/WebSocket.js`| `Polkadot.js/Connection/WebSocket` |

The nodes can be accessed from node list on Blackprint Editor like below:
![SomYbBNG53](https://user-images.githubusercontent.com/11073373/148333916-e1ed64ef-9a4a-483b-8077-ff9600fd2d03.png)

## Import this nodes from URL
Please specify the version to avoid breaking changes.

> Still a template, this haven't been published on NPM yet

```js
Blackprint.loadModuleFromURL([
  'https://cdn.jsdelivr.net/npm/@blackprint/nodes-polkadot.js@0.1.0/dist/nodes-polkadotjs.mjs'
], {
  // Turn this on if you want to load .sf.js, and .sf.css
  // only with single .mjs
  loadBrowserInterface: true // set to "false" for Node.js/Deno
});
```

## Development

### Watch changes and run a local server
By running local server you can ask Blackprint Editor to connect into it.
```sh
$ npm start
```

### Build and minify
Bundle every files and minify it into 3 distributable file.
```sh
$ npm run build-prod
```

### Running Test
We will use Jest to do the testing for Browser and Node.js.
```sh
$ npm test
```

## Import this nodes from URL
Please specify the version to avoid breaking changes.

```js
Blackprint.loadModuleFromURL([
	'https://cdn.jsdelivr.net/npm/@blackprint/nodes-polkadot.js@0.1/dist/nodes-polkadotjs.mjs'
], {
	// Turn this on if you want to load .sf.js, and .sf.css
	// only with single .mjs
	loadBrowserInterface: true // set to "false" for Node.js/Deno
});
```

## Development URL
You can use this link to load unpublished nodes and still under development on GitHub.
> `https://cdn.jsdelivr.net/gh/Blackprint/nodes-polkadot.js@dist/nodes-polkadotjs.mjs?1`

Please append `/url-here?random-number` if your browser still using the cached files after the repository was updated.

<!--
> `https://purge.jsdelivr.net/gh/Blackprint/nodes-polkadot.js@dist/nodes-polkadotjs.mjs`
-->

### License
MIT

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FBlackprint%2Fnodes-polkadot.js.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FBlackprint%2Fnodes-polkadot.js?ref=badge_large)