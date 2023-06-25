# 0.8.0

## Changes
- Blackprint Engine v0.9 is required

# 0.7.0

## Changes
- The major version of `@polkadot/keyring`, `@polkadot/util`, `@polkadot/util-crypto` dependencies was updated v11 to v12
- Encryption and decryption node was removed following changes from `@polkadot/keyring`'s breaking changes
  - Removed node: `Polkadot.js/Data/Keyring/Encrypt`
  - Removed node: `Polkadot.js/Data/Keyring/Decrypt`

# 0.6.0

## Changes
- The major version of `@polkadot` dependencies was updated from `v9 and v10` to `v10 and v11`

# 0.5.2

## Bug Fix
- Fix error on experimental nodes when the network doesn't support it
- Allow `ChainId` with 0 as the value when converting address
- Rename title for `Convert/Address To/Uint8Array` node

# 0.5.1

## Bug Fix
- Fix bundled module type and update example

# 0.5.0

## Feature
- Add in-editor documentation for some generated and experimental nodes

## Bug Fix
- Avoid using `this` on `Port.Trigger` and modify experimental nodes
- Show message if failed to preparing WebSocket API

## Breaking Changes
- Node `Polkadot.js/Keyring/Dummy` changed into `Polkadot.js/Keyring/RandomSeed`
- Change some namespace for experimental nodes

# 0.4.0

## Feature
- Add data structure for some port
- Add nodes documentation for Blackprint Editor
- Add route port element
- Add support for using different extension id
- Nodes now can be used on Node.js environment

## Bug Fix
- Fix module to be used for Node.js and update dependency versions
- Fix incorrect provider type
- Fix dependency
- Fix for unit test when the node failed to find meta error
- Fix polyfill and update version for browser
- Set `rpcURL` data property enumerable
- Hide node suggestion for some experimental nodes

## Breaking Changes
- Blackprint Engine v0.7 is required

# 0.3.0

## Breaking Changes
- `Polkadot.js/Data/Sign` node now need to be manually triggered
- `Polkadot.js/Account/Transfer` is renamed to `Polkadot.js/Account/Transfer/Balance`
- Rename output port `OnFinish` to `Finished` for experimental Substrate Extrinsics node

## Bug Fix
- Fix and improve experimental nodes for Substrate Metadata
- Fix some module loader for Node.js and update version
- Simplify PaymentInfo node implementation
- Improve some node's input/output type data
- Modify some node's description

## Features
- Improve nodes for doing transaction
- Add support to submit batch transaction
- Show transaction status and add callback ports
- Improve nodes for sign data with browser extension
- Add support for remote collaboration for some nodes
- Add node for converting Uint8Array to Hex

# 0.2.0

## Features
- Add experimental nodes for Substrate RPC, Extrinsics, Storage, Const
- Add nodes for connect to the network with HTTP or WebSocket
- Add nodes for creating keypair and keyring
- Add nodes for encrypt/decrypt data
- Add nodes for sign/verify data
- And some other updates since v0.1.0