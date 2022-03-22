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