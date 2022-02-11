[![NPM](https://img.shields.io/npm/v/@blackprint/nodes-polkadot.js.svg)](https://www.npmjs.com/package/@blackprint/nodes-polkadot.js)
[![Build Status](https://github.com/Blackprint/nodes-polkadot.js/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/Blackprint/nodes-polkadot.js/actions/workflows/build.yml)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FBlackprint%2Fnodes-polkadot.js.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FBlackprint%2Fnodes-polkadot.js?ref=badge_shield)

## Polkadot.js integration for Blackprint

[Blackprint](https://github.com/Blackprint/Blackprint) is a visual programming tools that can help you experimenting with [Polkadot.js's APIs](https://polkadot.js.org/docs/api).

---

### Examples
For more updated example, please go to [/example](https://github.com/Blackprint/nodes-polkadot.js/tree/main/example) folder and import it with [Blackprint Editor](https://blackprint.github.io/dev.html).

<details>
  <summary>Listening to new block (JSON)</summary>

Open [this example](https://blackprint.github.io/dev.html#page/sketch/1#;importSketch:rZJbi9swEIX_itBrXSkX26R-2jbtQ0tYluyWUpawKJJwHMsaY8nJpsH_vWMn7jp7gRb6JKQZnfPNkY70gSZHWoCqjf52S5N7uvG-dAnnUlm2dUqbbFcxqz23ZcGv1kbIvKwyi3tQ2r0vweRCgcfeqxEbc5W556WtY8XW0eAfpVFuOpSTYB0Y_V-0lJZQCZ-BZUVmO8lVE9Cbp2H4HKzVsm3hP_T6FmSuPeZzpBlNRgF9pEk0CegBl3FAJRSFtliniKaEF22qVSm_Lxd4tnctKW6Z22Tr-iCYcF50uHuocorOUPuy9u2tjzdfe5swoFYUGhXaw2bVNEF3Ph7aT8Lw7_z3jnntPBO_dAVM6d2bvtEL31VA56f4-QLSvm_SccRR3IGMo9kFyBl2em4KT7Tx5LJpdZn6lx0WHP9kMG83yAElwtHJJ_7wbN6nGa7rYq2rAV4_hj0M4ovOcrNXid7Wm77QQ_jPf34Sv9OPnl8DhtzfiM-zz14H7x9qJ0zdyv6EmkhhiTAOyPxuuSDvyDJLN55Ik8mcAJZICZUnHkiqPXF1muKTakXab00RqPkN) on Blackprint Editor.

If you import with this JSON on Blackprint Editor.
```json
{"_":{"moduleJS":["https://cdn.jsdelivr.net/npm/@blackprint/nodes-polkadot.js@0.1/dist/nodes-polkadotjs.mjs","https://cdn.jsdelivr.net/npm/@blackprint/nodes@0.3/dist/nodes-console.mjs","https://cdn.jsdelivr.net/npm/@blackprint/nodes@0.3/dist/nodes-decoration.mjs"]},"Polkadot.js/Connection/WebSocket":[{"i":0,"x":52,"y":51,"data":{"rpcURL":"wss://rpc.shibuya.astar.network"},"output":{"API":[{"i":2,"name":"API"}]}},{"i":4,"x":52,"y":244,"data":{"rpcURL":"wss://ws.test.azero.dev"},"output":{"API":[{"i":5,"name":"API"}]}}],"Console/Log":[{"i":1,"x":656,"y":158},{"i":6,"x":654,"y":262}],"Polkadot.js/Events/Blocks":[{"i":2,"x":406,"y":69,"output":{"Number":[{"i":1,"name":"Any"}]}},{"i":5,"x":408,"y":262,"output":{"Number":[{"i":6,"name":"Any"}]}}],"Decoration/Text/Notes":[{"i":3,"x":658,"y":69,"data":{"value":"You can also CTRL + Right click on a port to get suggested node"}}]}
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

All files will be bundled and the variables declared on this library will not automatically declared on the global context.<br>
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
- Westend's testnet will be used (My mnemonic is stored on GitHub Action's secret)
  - Wallet A: `5Dc4TJ7Ky7LsXpaVZQAeUTsZgKbVSBxZviEw4Gg3P7S4jbYx`
  - Wallet B: `5GjKBG89WT1zvJohwrEm8RgzT5ZGWEyBN4Vgqsvt48aZHsRv`
- If you're going to test from your environment, please rename `.env.example` to `.env` and edit it

```sh
$ npm test
```

---

## Import this nodes from URL
Please specify the version to avoid breaking changes.

```js
Blackprint.loadModuleFromURL([
  'https://cdn.jsdelivr.net/npm/@blackprint/nodes-polkadot.js@0.1/dist/nodes-polkadotjs.mjs'
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
