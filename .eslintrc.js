module.exports = {
	"env": {
		"browser": true,
		"es2021": true,
		"node": true
	},
	"extends": "eslint:recommended",
	"parserOptions": {
		"sourceType": "module",
		"ecmaVersion": "latest"
	},
    "globals": {
		// Unit tests variables
        "MyInstance": "readonly",
        "describe": "readonly",
        "expect": "readonly",
        "test": "readonly",
        "sf": "readonly",
        "jest": "readonly",

		// Source files variables
        "Blackprint": "readonly",
		"polkadotApi": "readonly",
		"polkadotKeyring": "readonly",
		"polkadotTypes": "readonly",
		"polkadotUtilCrypto": "readonly",
		"polkadotUtil": "readonly",
		"polkadotExtensionDapp": "readonly",
        "Context": "readonly",
        "NodeToast": "readonly",
        "Signer": "readonly",
        "Transaction": "readonly",
        "CrypterNode": "readonly",
        "Substrate_BlackprintNodeGenerator": "readonly",
    }
}
