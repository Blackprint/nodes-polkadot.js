[![NPM](https://img.shields.io/npm/v/@blackprint/nodes-polkadot.js.svg)](https://www.npmjs.com/package/@blackprint/nodes-polkadot.js)
[![Build Status](https://github.com/Blackprint/nodes-polkadot.js/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/Blackprint/nodes-polkadot.js/actions/workflows/build.yml)

## Polkadot.js integration for Blackprint

### Examples
If you want to just try using Blackprint with this nodes you can use the example below.

<details>
	<summary>Listening to new block (JSON)</summary>

Open [this example](https://blackprint.github.io/dev.html#page/sketch/1#;importSketch:rZJBj5swEIX_ijXXUjvJAko5pU17aBWtVtmtqqqKKse2CAE8CA_JphH_vYaELdpVbj0hxjPfe_PsM_yG5Awl6qYw3x4h-QU7osolQiht-d5pU2SHmltDIt2JT4VUeVVnloRFbdz7CotcaiTfudCZe13eO17uHQS3obYqxWL7CruY8CmfiBFQoXVYmP9E00ZhLSlDy8vM9tBNG8DDv2XEEq01qmsRP8z2EVVuyKdzhgySSQDPkESzAE7-Mw1AS5JdjHWlvq9XkMDRdfb8L3e7bNucJJeOZO_xiHUOXgwbqhrqpj4-fB3IYQBWlsYTumK7adugr0_HirMwvCl5dJyMIy7_mBq5NoebUtEbqU0Ay0vMYoXp0DfrpeMo7rWn0fxq6e5aDy-e4lk3P07wy8FYcv7J-OzcaEE_FU4utPjD2Nx9U25NPdId_NnTKIroSpgPurcRd28Q3uLnl7sXT-aZxD36wIaJ-LrU_MXekPNBFk1H-okNU9IyWThky6f1ir1j6yzdEVNFpnKG_ohVWBMjZKkh5po09TdiNOveHngP7V8) on Blackprint Editor.

If you import with this JSON on Blackprint Editor, don't forget to clear the Sketch Pages first.
```json
{"_":{"moduleJS":["https://cdn.jsdelivr.net/gh/Blackprint/nodes-polkadot.js@dist/nodes-polkadotjs.mjs?5","https://cdn.jsdelivr.net/npm/@blackprint/nodes@0.1.0/dist/nodes-console.mjs","https://cdn.jsdelivr.net/npm/@blackprint/nodes@0.1.0/dist/nodes-decoration.mjs"]},"Polkadot.js/Connection/WebSocket":[{"i":0,"x":52,"y":51,"data":{"rpcURL":"wss://rpc.shibuya.astar.network"},"output":{"API":[{"i":2,"name":"API"}]}},{"i":4,"x":52,"y":244,"data":{"rpcURL":"wss://ws.test.azero.dev"},"output":{"API":[{"i":5,"name":"API"}]}}],"Console/Log":[{"i":1,"x":656,"y":158},{"i":6,"x":654,"y":262}],"Polkadot.js/Events/Blocks":[{"i":2,"x":406,"y":69,"output":{"Number":[{"i":1,"name":"Any"}]}},{"i":5,"x":408,"y":262,"output":{"Number":[{"i":6,"name":"Any"}]}}],"Decoration/Text/Notes":[{"i":3,"x":658,"y":69,"data":{"value":"You can also CTRL + Right click on a port to get suggested node"}}]}
```
</details>

<details>
	<summary>Do a transaction (JSON)</summary>

> Currently this may have bugs

Open [this example](https://blackprint.github.io/dev.html#page/sketch/1#;importSketch:rVVdb9owFP0rkV-2SYzEIQkEaVLpMm1lVZUVRj-2ajKxC4FgR7ETSCv--5w4kADttoe9VOVyfc65X4dn8Av0n8GK4TQiwxHo_wBzIWLe1_UA0_aCYxKFWdKmROizuX4eoWAZJyEVOmWY8Pcxi5YIMyEzz3DIj8ML3l4tOGi9DkrjlX42PYI9M9qwbegNwJDGqfhPWAGjnEXkP6FhErAEiZDR9iqkJejDtgX8ujH6R0YpCYoU_YZMRyxYEiE7_QxC0DdaYAP6XacFctDvwRbASKBiJEkcfL--BH2w5oU8-bHN5-E0zVEbcYFKjWuWLIEkY6mQ7Sle-QnLQkySHbzEpWhFJMz-m-1DCwz8i10G3GcUwW2rDJqHwYdt8ahZ0qeMUMHlPshieANK1mLZsCzGtI8fDYKApbKT4wRR_liLNNU7q1u-g67drGi8oafFFMFKavcwqKReFOuij8lGnLPN7nmnpIGGqeSZvbrZGYrSAuKez8eO_YRxZl1e3g96LpvA4a1Ps0n4NPZY7uRkPHTtaSZur8TEOez9RIH8OO4gxgnhvJSmJFtKiKX61DGdUyGQQPOf0FW4xrarIo0S2zJewEbZ8i4feiy9nsx9Fszi4LM_6Qy-TDxEhosO5xPHW9zdXvk3T5tv994fZED4YpVHYy_HjdT--yhfyc25oI-sMVWpuGfZavqw26RrJvZqMpr_jWhEKN497JYMTq8avAObDCOBRFqvcOclko_KMfRLNmuIKftsu0q2YVUDcMsvXEPFLQseq2y4waeNIJTL__b0RiW1W41P0oSyDjBN2JqT5AZFkfSOeqZ4EMdXSu-5_75Bczi16vL2ZbpHVcqL4YMoYmuCX0s5tYCdeH0Uzmh9zbCygd16272Ddh_k1sdbxV_g-Upy6b8z3UtXq3xPojzDqTzDtF7ncF7h2A31MxHXRLoRoQFprkExRWhVK2MWL7y91ZfWol8xQerNUVftKie3XPf08O5Yqq3DKNIoIVgTTAvmiM6IhqYsk3_VBckMMddylib7yCNLtJHyfn1QeL8meYX0_5_0Jy2cQvugQW10fgd2LgDtSr86qk6nc6rGk5-VnCnRIjabSU2MatWmveFa9TupvfVINmYs4u8k_sP2Nw) on Blackprint Editor.

If you import with this JSON on Blackprint Editor, don't forget to clear the Sketch Pages first.
```json
{"_":{"moduleJS":["https://cdn.jsdelivr.net/gh/Blackprint/nodes-polkadot.js@dist/nodes-polkadotjs.mjs","https://cdn.jsdelivr.net/npm/@blackprint/nodes@0.1.0/dist/nodes-input.mjs","https://cdn.jsdelivr.net/npm/@blackprint/nodes@0.1.0/dist/nodes-console.mjs","https://cdn.jsdelivr.net/npm/@blackprint/nodes@0.1.0/dist/nodes-decoration.min.mjs"]},"Polkadot.js/Connection/WebSocket":[{"i":0,"x":76,"y":81,"data":{"rpcURL":"wss://rpc.shibuya.astar.network"},"output":{"Provider":[{"i":6,"name":"Provider"}],"API":[{"i":1,"name":"API"},{"i":2,"name":"API"}]}}],"Polkadot.js/Events/Blocks":[{"i":1,"x":451,"y":25}],"Polkadot.js/Account/Transfer":[{"i":2,"x":447,"y":195,"output":{"Txn":[{"i":6,"name":"Txn"},{"i":7,"name":"Txn"}]}}],"Input/TextBox":[{"i":3,"x":102,"y":228,"data":{"value":"ZshT65zddv4LLZA89oV1JXPnvVizTDoy6yeTJ95bvtXNtV6"},"output":{"Value":[{"i":2,"name":"Address"}]}},{"i":4,"x":141,"y":326,"data":{"value":"1e12"},"output":{"Value":[{"i":2,"name":"Value"}]}},{"i":5,"x":100,"y":406,"data":{"value":"avkYyJDouRVhPocgpcGPV3AHVDaeJj3ssV6DjYXNPWzxQZD"},"output":{"Value":[{"i":11,"name":"Address"}]}}],"Polkadot.js/Transaction/PaymentInfo":[{"i":6,"x":845,"y":117,"output":{"Info":[{"i":8,"name":"Any"}]}}],"Polkadot.js/Transaction/Send":[{"i":7,"x":682,"y":261,"output":{"Status":[{"i":13,"name":"Any"}]}}],"Console/Log":[{"i":8,"x":1059,"y":104},{"i":9,"x":909,"y":441}],"Polkadot.js/Connection/Extension":[{"i":10,"x":687,"y":408,"id":"browserWallet","data":{"dAppName":"BP-Polkadot.js"},"output":{"Accounts":[{"i":9,"name":"Any"}],"IsAllowed":[{"i":9,"name":"Any"}]}}],"Polkadot.js/Extension/Signer":[{"i":11,"x":441,"y":358,"output":{"Signer":[{"i":7,"name":"Signer"}]}}],"Polkadot.js/Keyring/Dummy":[{"i":12,"x":647,"y":24,"output":{"Signer":[{"i":6,"name":"Signer"}]}}],"Console/GetReference":[{"i":13,"x":914,"y":262}],"Decoration/Text/Notes":[{"i":14,"x":96,"y":499,"data":{"value":"You will need to change above address with your address for Shibuya/Astar testnet\n\n1e12 = 1 SBY"}},{"i":15,"x":915,"y":333,"data":{"value":"Data will be logged on browser's console (DevTools)"}}]}
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

<!--
> `https://purge.jsdelivr.net/gh/Blackprint/nodes-polkadot.js@dist/nodes-polkadotjs.mjs`
-->

### License
MIT