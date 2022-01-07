[![NPM](https://img.shields.io/npm/v/@blackprint/nodes-polkadot.js.svg)](https://www.npmjs.com/package/@blackprint/nodes-polkadot.js)
[![Build Status](https://github.com/Blackprint/nodes-polkadot.js/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/Blackprint/nodes-polkadot.js/actions/workflows/build.yml)

## Polkadot.js integration for Blackprint

### Information
You can use [this link](https://blackprint.github.io/dev.html#page/sketch/1#;importSketch:nZJRb5swFIX_iuXXMZukwDKesmV72BRVVdppmqpocmyLOIAvwpekWcR_ryGhRa3ysifE9b3fOffYJ_qXpidagmoK_fOepo90i1i5lHOpLNs5pQuzr5nVyLMt_1oImVe1scgtKO0-VlDkQgH6zrky7m1551i5czS4DrVVyeebN9h5yCYs5COgBOug0P9LC9mnMU1pCbVAA5aVxvbQdRvQu9dl-AKs1bJr4b_15h5krtGnc6KGpmFAn2gaTwN69J9JQJVA0cVYV_LXaklTenCdPf_L3NZsmqNgwqHoPR6gzqkXgwarBrupL3c_BnIUUCtK7QldsV23bdDXJ2PFaRRdlTw4htohE_90DUzp_VWp-J3UOqCLc8x8CdnQN-2lkzjptSfx7GLp5lKPzp6SaTc_TvD7Xlt0_sn47NxoQT8VhWda8nls7rYpN7oe6Q7-7HEURXwhzAbd64ibdwhv8dvL3fMH_YT8Fnxgw0RyWWr2Ym_IeS-KpiP9gYZIYYkoHJDFw2pJPpCVybZIZGFkTsAfkQpqJAgk00hck2X-RrQi3duj3kP7DA) for trying the current nodes implementation on Blackprint Editor.

<details>
	<summary>JSON</summary>

	{"_":{"moduleJS":["https://cdn.jsdelivr.net/gh/Blackprint/nodes-polkadot.js@dist/nodes-polkadotjs.mjs?1","https://cdn.jsdelivr.net/npm/@blackprint/nodes@0.1.0/dist/nodes-console.mjs","https://cdn.jsdelivr.net/npm/@blackprint/nodes@0.1.0/dist/nodes-decoration.mjs"]},"Polkadot.js/Connection/WebSocket":[{"i":0,"x":52,"y":51,"data":{"rpcURL":"wss://rpc.shibuya.astar.network"},"output":{"API":[{"i":2,"name":"API"}]}},{"i":4,"x":52,"y":244,"data":{"rpcURL":"wss://ws.test.azero.dev"},"output":{"API":[{"i":5,"name":"API"}]}}],"Console/Log":[{"i":1,"x":656,"y":158},{"i":6,"x":654,"y":262}],"Polkadot.js/Events/Blocks":[{"i":2,"x":406,"y":69,"output":{"Number":[{"i":1,"name":"Any"}]}},{"i":5,"x":408,"y":262,"output":{"Number":[{"i":6,"name":"Any"}]}}],"Decoration/Text/Notes":[{"i":3,"x":658,"y":69,"data":{"value":"You can also CTRL + Right click on a port to get suggested node"}}]}
</details>

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
  'https://cdn.jsdelivr.net/npm/@blackprint/nodes-polkadot.js@0.0.1/dist/nodes-polkadotjs.mjs'
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

## Development URL
You can use this link to load unpublished nodes and still under development on GitHub.
> `https://cdn.jsdelivr.net/gh/Blackprint/nodes-polkadot.js@dist/nodes-polkadotjs.mjs?1`

Please append `/url-here?random-number` if your browser still using the cached files after the repository was updated.

### License
MIT