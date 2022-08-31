[![NPM](https://img.shields.io/npm/v/@blackprint/nodes-polkadot.js.svg)](https://www.npmjs.com/package/@blackprint/nodes-polkadot.js)
[![Build Status](https://github.com/Blackprint/nodes-polkadot.js/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/Blackprint/nodes-polkadot.js/actions/workflows/build.yml)

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
Click [this link](https://blackprint.github.io/#page/sketch/1#;openExample:github.com/Blackprint/nodes-polkadot.js) to open example list in Blackprint Editor.

You can also manually import a JSON for [Blackprint Editor](https://blackprint.github.io/dev.html) from [/example](https://github.com/Blackprint/nodes-polkadot.js/tree/main/example) directory.

This repository also have [example Dockerfiles](https://github.com/Blackprint/nodes-polkadot.js/tree/main/.github/docker) in case if you want to run the unit test, and run example project for Node.js or Deno in isolated environment.

### Run in different environment
Blackprint is designed to be able to run in multiple environment, you can also easily export your schema into JSON and run it in Node.js, Deno, or browser. Below is a quick and simple tutorial that can help you getting started:

<details>
	<summary>Click this to open the guide for Deno</summary>

When using Deno, it's pretty easy to start with as you can easily import module with URL natively. Let's get straight into the code, for a quick start you can copy and paste the code below:
```js
import Blackprint from 'https://cdn.skypack.dev/@blackprint/engine';

// Only allow load module from specific domain
Blackprint.allowModuleOrigin('cdn.jsdelivr.net');

// Fix the bundled version of Polkadot.js's library for Deno
globalThis.location = { href: '' };

// Create the instance and import the JSON
let MyInstance = new Blackprint.Engine();
await MyInstance.importJSON(`{ ... }`);

// Don't forget to add an ID to your node so you can easily access it like below
let { your_node_id, other_node_id } = MyInstance.ref;
```

After you replaced the JSON, you can run the app with:
```sh
$ deno run --allow-net ./init.mjs
```

---

</details>

<details>
	<summary>Click this to open the guide for Node.js</summary>

When using Node.js you will need to install the Blackprint Engine and the modules. But you can also import the module via URL and it will be downloaded when you run your app.
```sh
$ cd /your/project/folder
$ npm init
$ pnpm i @blackprint/engine
```

For a quick start, you can copy and paste the code below:
```js
let Blackprint = require("@blackprint/engine");

// Only allow load module from specific domain (if using URL module loader)
Blackprint.allowModuleOrigin('cdn.jsdelivr.net');

// ..Import the required modules here if you're not using URL module loader..
// require("@blackprint/nodes-polkadot.js");

// Create the instance and import the JSON
let MyInstance = new Blackprint.Engine();
MyInstance.importJSON(`{ ... }`).then(function(){
  // Don't forget to add an ID to your node so you can easily access it like below
  let { your_node_id, other_node_id } = MyInstance.ref;
});
```

After you replaced the JSON, you can run the app with:
```sh
$ node ./init.mjs

# If you want to use HTTPS module loader you need to use this
$ node --loader ./node_modules/@blackprint/engine/es6-https-loader.mjs ./init.mjs
```

That's it, don't forget to add an ID to your node so you can easily access it from `MyInstance.ref`.

---

</details>

<details>
	<summary>Click this to open the guide for Browser</summary>

For browser, you will need to import the Blackprint Engine and the Vue framework. Below is the HTML example if you want to use CDN to load the library:
```html
<head>
  <!-- Blackprint Engine -->
  <script src="https://cdn.jsdelivr.net/npm/@blackprint/engine"></script>
  
  <!-- Vue 3 -->
  <script src="https://unpkg.com/vue@next"></script>
</head>
```

If you prefer to use bundler like Webpack or Vite, you may need to install the module with a package manager first:
```sh
$ pnpm install @blackprint/engine vue@next
```

After that you can write your Vue template and bind the engine instance with your Vue app:
```html
<body>
  <!-- Your Vue template -->
  <div id="v-model-basic">
    Port value: {{ your_node_id.Output.MyPort }}

    <input @input="your_node_id.Input.MyPortIn = $event.target.value">
  </div>

  <script>
    // Only allow module import from cdn.jsdelivr.net  
    Blackprint.allowModuleOrigin('cdn.jsdelivr.net');

    // Create new engine instance
    var instance = new Blackprint.Engine();

    // You can copy paste this to Blackprint Editor
    instance.importJSON(`{ ... }`).then(function(){
      // Create Vue app and bind the Blackprint port references with the app
      Vue.createApp({
        data() {
          // Obtain Interface by ID and get the port references
          let { your_node_id, other_node_id } = instance.ref;

          // Vue 3 is using Proxy for their reactivity
          // You may need to use event listener and update Vue element's value manually like:
          your_node_id.IOutput.MyPort.on('value', ({ port })=> this.myProp = port.value);

          // Put the ports reference to this component scope
          return { your_node_id, other_node_id };
        }
      }).mount('#v-model-basic');
    });
  </script>
</body>
```

That's it, don't forget to add an ID to your node so you can easily access it from `instance.ref`.

Some example:
1. [Blackprint + Vue 3](https://jsbin.com/ricoyej/edit?html,output)
2. [Blackprint + React](https://jsbin.com/lexidop/edit?js,output)

---

</details>

## Development
> If you want to help contributing with this Blackprint module, you can follow instruction below. But if you just want to use this module for your project, you can open [this example list](https://blackprint.github.io/#page/sketch/1#;openExample:github.com/Blackprint/nodes-polkadot.js) on Blackprint Editor or just import the module for your app with Node.js or Deno project.

You will need to clone this repository and install the required dependencies.
```sh
# You can also use npm or yarn instead of pnpm
$ pnpm install
```

### Watch changes and run a local module server
By running local server you can ask Blackprint Editor to connect into it to enjoy hot reload.<br>
If you only want to do a testing, please skip this step.
```sh
$ npm start
 >> [Browsersync] Access URLs:
 >> -----------------------------------
 >> Local: http://localhost:6789
 >> ---------------
```

<details>
  <summary>Click here to see more detail</summary>

After running the module server, you can go to https://blackprint.github.io/dev.html and open a new sketch. Click the main menu on the top left and click Remote -> Module, then paste your module server's URL the click Connect.

![brave_7NcrWUt66n](https://user-images.githubusercontent.com/11073373/159176092-7271f980-2a70-4e38-8830-e9746170426d.png)
</details>

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

## Import this nodes from URL
If you're planning to develop your own sketch/editor for your project, there are some [example](https://github.com/Blackprint/Blackprint#example) on the Blackprint repository to help you get started on how to implement the sketch or use the engine with another framework.

Please specify the version to avoid breaking changes.

```js
Blackprint.loadModuleFromURL([
  'https://cdn.jsdelivr.net/npm/@blackprint/nodes-polkadot.js@0.5.x/dist/nodes-polkadotjs.mjs'
], {
  // Turn this on if you want to load ".sf.js" and ".sf.css" for browser
  loadBrowserInterface: true // set to "false" for Node.js/Deno
});
```

### Load unpublished module from GitHub
You can use this link to load unpublished nodes that still under development on GitHub.<br>
https://cdn.jsdelivr.net/gh/Blackprint/nodes-polkadot.js@dist/nodes-polkadotjs.mjs?1

> Please append `/url-here?random-number` if your browser still using the cached files

<!--
> You will need to purge cache from jsdelivr
> https://purge.jsdelivr.net/gh/Blackprint/nodes-polkadot.js@dist/nodes-polkadotjs.mjs

https://github.com/jsdelivr/jsdelivr#caching
-->

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
| `./src/Account/Transfer/Balance.js`| `Polkadot.js/Account/Transfer/Balance` |
| `./src/Connection/WebSocket.js`| `Polkadot.js/Connection/WebSocket` |

With the above structure, you can easily find the nodes on Blackprint Editor like below:

![0AGnpEq98x](https://user-images.githubusercontent.com/11073373/162767398-c35de16e-e1a8-4b47-9686-821927b6c3c4.png)


### License
This module is released with MIT license and depends on Polkadot.js library with Apache 2.0 license.

<!--
https://github.com/polkadot-js/api/pull/4672 (PR merging GPL library)
https://github.com/polkadot-js/api/issues/2666 (Why Apache 2.0 license)
-->