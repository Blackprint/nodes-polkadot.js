This template contain an example that can be used for reference developing new Blackprint Module for Browser, Node.js, or Deno with ScarletsFrame compiler. Make sure you have modify the config file and remove the unused code when developing.

You may find file that has below extension
 - `.sf`: to be exported for Browser only
 - `.js`: to be exported for Browser/Node.js/Deno

## Note
Currently this template is not using ES6 modules import system, you will need to use CDN link to load a library. If you have better idea for the Browser/Node.js/Deno import system, lets discuss it on Blackprint repository :)

If Blackprint have an breaking changes (v0.\*.0), make sure to visit this template again to see what was changed 😉

---

## Getting started building new nodes
 - Clone or create new repository with this template
 - Modify `blackprint.config.js` and change the `disabled` option into `false`
 - Choose one of the two method
   - Put the project folder inside `/Blackprint/nodes/...`
     - Call `npm start` from `/Blackprint/` directory
     - The editor, engine, and nodes will be watched together
   - Use Blackprint CLI tools
     - `pnpm i -g @blackprint/cli-tools`
     - You can start the server with `blackprint serve`
     - It's already have hot reload, so you can modify your script quickly
     - To enable to hot reload, you must connect Blackprint Editor to Blackprint module server
     - To compile modules for production you can use `blackprint build production`

The compiler will watch every changes inside this folder by following the configuration in `blackprint.config.js`.

Before opening `.sf` file, please install the [syntax highlighter](https://github.com/StefansArya/scarletsframe-compiler/tree/master/syntax-highlighter) for your text editor.

> BPIC = Blackprint Interface Component

For another information like load/importing node for Browser/Node/Deno, please go to the [documentation](http://stefansarya.gitbook.io/blackprint).

---

## Versioning Note
The versioning should follow this format v`MAJOR.MINOR.PATCH` when reach `v1.0.0`.

**MAJOR version** when the nodes have breaking changes.<br>
**MINOR version** when you add has new feature.<br>
**PATCH version** when you do bug fixes that backwards compatible.<br>

Changes that are considered as breaking (case-sensitive):
 - Change on port name `(output -> Output)`
 - Port data type changes `Number -> String`
   - If it was changed to `Any` or `Union` that contain original data type, it's not a breaking changes
 - Deleted node or renamed node `(Clear/Cahce -> Clear/Cache)`
   - Only for name registered with `.registerNode(...)`
 - Interface/node function changes
   - Only if you provide an documentation to call that function when obtaining the nodes with
   - `iface.call = ... -> iface.trigger = ...`
   - `node.call = ... -> node.trigger = ...`

The example for `Interface/node function changes`.
```js
// Let's assume you have created 'call' function and rename it to 'trigger'
// in .registerNode('...') or .registerInterface('...')
let button = engine.getNodes('...');

// This will breaking due to changes
button.call(); // -> button.trigger()
button.iface.call(); // -> button.iface.trigger()
```

---

If you think it will have design changes or many breaking changes. The versioning increment should follow the format below.

**MAJOR version** always zero "0".<br>
**MINOR version** when you add has new feature, or possible breaking changes.<br>
**PATCH version** when you do bug fixes or add new feature that backwards compatible.<br>

### License
MIT