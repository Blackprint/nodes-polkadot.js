[![NPM](https://img.shields.io/npm/v/@blackprint/nodes-polkadot.js.svg)](https://www.npmjs.com/package/@blackprint/nodes-polkadot.js)
[![Build Status](https://github.com/Blackprint/nodes-polkadot.js/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/Blackprint/nodes-polkadot.js/actions/workflows/build.yml)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FBlackprint%2Fnodes-polkadot.js.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FBlackprint%2Fnodes-polkadot.js?ref=badge_shield)

## Polkadot.js integration for Blackprint

This module gives you an ability to use [Polkadot.js's APIs](https://polkadot.js.org/docs/api) with [Blackprint](https://github.com/Blackprint/Blackprint).

<details>
	<summary>Quick walkthrough on how to load module and open some example</summary>

> If the video looks blurry, please right click and open it on the new tab

https://user-images.githubusercontent.com/11073373/153986424-9e75c62e-42a8-49eb-b9af-144801067e00.mp4

Below is the summary and some information of the video:
1. Open Blackprint editor's sketch page
2. Creating notes node (this module get loaded when you choose the example)
3. Load `nodes-polkadot.js` module from NPM repository
    - You may see a loading progress on your first try
4. Creating new nodes from `nodes-polkadot.js` module
5. Opening example that get loaded to our editor when we choose the module
    - The example is loaded from the published release on NPM registry
    - But you can also manually copy paste the JSON content from the [/example](https://github.com/Blackprint/nodes-polkadot.js/tree/main/example) directory to load it on the editor
6. Open `encrypt/decrypt` example
    - If the published example for `encrypt/decrypt` was looks compact and complicated, please import from the updated [/example](https://github.com/Blackprint/nodes-polkadot.js/tree/main/example) instead
    - On this example there are 2 keypair that is randomly generated, the address may different and causes the `Decrypt Data` node can't decrypted the data from `Encrypt Data` node because the author address was different
    - You will need to copy Alice's wallet address from `Log` node to `Input` node that connected to `Encrypt Data`, the node then will encrypt the data with Alice's public key/wallet address
    - The `testing` message will now get encrypted for Alice's wallet from Bob's wallet and can be decrypted by Alice's wallet where the author is Bob's wallet
7. Open `sign verify: extension` example
    - On your first try, you may need to allow Blackprint on your Polkadot.js's browser extension
    - Then, please copy your wallet address for testing into the input box
    - After you connect the signer, it will ask your extension to sign the message: `testing`
    - By the way if you see an error message on my DevTools, it's because I canceled the extension to sign the message

</details>

---

### Examples
For more updated example, please go to [/example](https://github.com/Blackprint/nodes-polkadot.js/tree/main/example) directory and import it with [Blackprint Editor](https://blackprint.github.io/dev.html).

<details>
  <summary>Listening to new block (JSON)</summary>

Open [this example](https://blackprint.github.io/dev.html#page/sketch/1#;importSketch:rZJbi9swEIX_itBrXSkX26R-2jbtQ0tYluyWUpawKJJwHMsaY8nJpsH_vWMn7jp7gRb6JKQZnfPNkY70gSZHWoCqjf52S5N7uvG-dAnnUlm2dUqbbFcxqz23ZcGv1kbIvKwyi3tQ2r0vweRCgcfeqxEbc5W556WtY8XW0eAfpVFuOpSTYB0Y_V-0lJZQCZ-BZUVmO8lVE9Cbp2H4HKzVsm3hP_T6FmSuPeZzpBlNRgF9pEk0CegBl3FAJRSFtliniKaEF22qVSm_Lxd4tnctKW6Z22Tr-iCYcF50uHuocorOUPuy9u2tjzdfe5swoFYUGhXaw2bVNEF3Ph7aT8Lw7_z3jnntPBO_dAVM6d2bvtEL31VA56f4-QLSvm_SccRR3IGMo9kFyBl2em4KT7Tx5LJpdZn6lx0WHP9kMG83yAElwtHJJ_7wbN6nGa7rYq2rAV4_hj0M4ovOcrNXid7Wm77QQ_jPf34Sv9OPnl8DhtzfiM-zz14H7x9qJ0zdyv6EmkhhiTAOyPxuuSDvyDJLN55Ik8mcAJZICZUnHkiqPXF1muKTakXab00RqPkN) on Blackprint Editor.

You can also import this JSON into Blackprint Editor.
```json
{"_":{"moduleJS":["https://cdn.jsdelivr.net/npm/@blackprint/nodes-polkadot.js@0.2/dist/nodes-polkadotjs.mjs","https://cdn.jsdelivr.net/npm/@blackprint/nodes@0.3.1/dist/nodes-console.mjs","https://cdn.jsdelivr.net/npm/@blackprint/nodes@0.3.1/dist/nodes-decoration.mjs"]},"Polkadot.js/Connection/WebSocket":[{"i":0,"x":52,"y":51,"data":{"rpcURL":"wss://rpc.shibuya.astar.network"},"output":{"API":[{"i":4,"name":"API"}]}},{"i":1,"x":52,"y":244,"data":{"rpcURL":"wss://ws.test.azero.dev"},"output":{"API":[{"i":5,"name":"API"}]}}],"Console/Log":[{"i":2,"x":656,"y":158},{"i":3,"x":654,"y":262}],"Polkadot.js/Events/Blocks":[{"i":4,"x":406,"y":69,"output":{"Number":[{"i":2,"name":"Any"}]}},{"i":5,"x":408,"y":262,"output":{"Number":[{"i":3,"name":"Any"}]}}],"Decoration/Text/Notes":[{"i":6,"x":658,"y":69,"data":{"value":"You can also CTRL + Right click on a port to get suggested node"}}]}
```
</details>

---

### Distributable files

All files inside `src` folder will be bundled into 3 distributable file. Some file is optional to be loaded on the target environment.

```js
// all .js files
- dist/nodes-polkadotjs.mjs    // For browser, Node.js, and Deno (required)

// all .sf files
- dist/nodes-polkadotjs.sf.mjs // For browser only (required)
- dist/nodes-polkadotjs.sf.css // For browser only (optional)
```

## Directory structure

Configuration file can be changed from `./blackprint.config.js`.<br>
The `src` directory structure is arranged like below:

| File path | Blackprint Node path |
|---|---|
| `./src/Account/Transfer.js`| `Polkadot.js/Account/Transfer` |
| `./src/Connection/WebSocket.js`| `Polkadot.js/Connection/WebSocket` |

With the above structure, you can easily find the nodes on Blackprint Editor like below:

![SomYbBNG53](https://user-images.githubusercontent.com/11073373/148333916-e1ed64ef-9a4a-483b-8077-ff9600fd2d03.png)

## Development

You will need to clone this repository and install the required dependencies.
```sh
$ npm install
```

### Watch changes and run a local server
By running local server you can ask Blackprint Editor to connect into it to enjoy hot reload.<br>
If you only want to do a testing, please skip this step.
```sh
$ npm start
```

### Build and minify
Bundle every files and minify it into 3 distributable file.
```sh
$ npm run build-prod
```

### Running Test
- We will use Jest to do the testing for Browser and Node.js
- Before running this test, make sure you have build this module
- Westend's testnet will be used (My mnemonic is stored on GitHub Action's secrets)
- If you're going to test from your environment, please rename `.env.example` to `.env` and edit it
- Address for ChainId: 42
  - Wallet A: `5CPKqqEXE3YHKProqt5e6o8Lw9xBSdpf5Ex44U5WjL82yKPj`
  - Wallet B: `5CdiLQpHyeJJsdgP5azER3dtBmgRTNhYQhLxRdmBmRqXQRGH`

```sh
$ npm test
```

---

## Import this nodes from URL
If you're planning to develop your own sketch/editor for your project, there are some [example](https://github.com/Blackprint/Blackprint#example) on the Blackprint repository to help you get started on how to implement the sketch or use the engine with another framework.

Please specify the version to avoid breaking changes.

```js
Blackprint.loadModuleFromURL([
  'https://cdn.jsdelivr.net/npm/@blackprint/nodes-polkadot.js@0.2/dist/nodes-polkadotjs.mjs'
], {
  // Turn this on if you want to load ".sf.js" and ".sf.css" for browser
  loadBrowserInterface: true // set to "false" for Node.js/Deno
});
```

## Development URL
You can use this link to load unpublished nodes that still under development on GitHub.<br>
https://cdn.jsdelivr.net/gh/Blackprint/nodes-polkadot.js@dist/nodes-polkadotjs.mjs?1

> Please append `/url-here?random-number` if your browser still using the cached files

<!--
> You will need to purge cache from jsdelivr
> https://purge.jsdelivr.net/gh/Blackprint/nodes-polkadot.js@dist/nodes-polkadotjs.mjs
-->

### License
MIT

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FBlackprint%2Fnodes-polkadot.js.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FBlackprint%2Fnodes-polkadot.js?ref=badge_large)
