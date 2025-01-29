// Get the environment configuration from .env file
//
// To make use of automatic environment setup:
// - Duplicate .env.example file and name it .env
// - Fill in the environment variables
import 'dotenv/config'

import 'hardhat-deploy'
import 'hardhat-contract-sizer'
import '@nomiclabs/hardhat-ethers'
import "@nomicfoundation/hardhat-verify";
import '@layerzerolabs/toolbox-hardhat'
import { HardhatUserConfig, HttpNetworkAccountsUserConfig } from 'hardhat/types'

import { EndpointId } from '@layerzerolabs/lz-definitions'

import './type-extensions'

// Set your preferred authentication method
//
// If you prefer using a mnemonic, set a MNEMONIC environment variable
// to a valid mnemonic
const MNEMONIC = process.env.MNEMONIC

// If you prefer to be authenticated using a private key, set a PRIVATE_KEY environment variable
const PRIVATE_KEY = process.env.PRIVATE_KEY

const accounts: HttpNetworkAccountsUserConfig | undefined = MNEMONIC
    ? { mnemonic: MNEMONIC }
    : PRIVATE_KEY
        ? [PRIVATE_KEY]
        : undefined

if (accounts == null) {
    console.warn(
        'Could not find MNEMONIC or PRIVATE_KEY environment variables. It will not be possible to execute transactions in your example.'
    )
}

const config: HardhatUserConfig = {
    paths: {
        cache: 'cache/hardhat',
    },
    solidity: {
        compilers: [
            {
                version: '0.8.22',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ],
    },
    networks: {
        'sepolia-testnet': {
            eid: EndpointId.SEPOLIA_V2_TESTNET,
            url: process.env.RPC_URL_SEPOLIA || 'https://rpc.sepolia.org/',
            accounts,
            oftAdapter: {
                tokenAddress: '0x0', // Set the token address for the OFT adapter
            },
        },
        'sonic-testnet': {
            eid: EndpointId.SONIC_V2_TESTNET,
            url: process.env.RPC_URL_SONIC_TESTNET || 'https://rpc.blaze.soniclabs.com',
            accounts,
            chainId: 57054,
            oftAdapter: {
                tokenAddress: '0xaF7E79D76D99d2117481Cb932C663db9bEB29ceF', // Set the token address for the OFT adapter
            },
        },
        'avalanche-testnet': {
            eid: EndpointId.AVALANCHE_V2_TESTNET,
            url: process.env.RPC_URL_FUJI || 'https://rpc.ankr.com/avalanche_fuji',
            accounts,
        },
        'amoy-testnet': {
            eid: EndpointId.AMOY_V2_TESTNET,
            url: process.env.RPC_URL_AMOY || 'https://rpc-amoy.polygon.technology', // https://polygon-amoy-bor-rpc.publicnode.com
            accounts,
            chainId: 80002,
        },
        'sonic': {
            eid: EndpointId.SONIC_V2_MAINNET,
            url: process.env.RPC_URL_SONIC_MAINNET || 'https://rpc.soniclabs.com',
            accounts,
            chainId: 146,
            oftAdapter: {
                tokenAddress: '0x7F144F8691CbA3d2EfD8e5bcf042f9303EE31a46', // Set the token address for the OFT adapter
            },
        },
        'real': {
            eid: EndpointId.REAL_V2_MAINNET,
            url: process.env.RPC_URL_REAL_MAINNET || 'https://real.drpc.org',
            accounts,
            chainId: 111188,
        },
        hardhat: {
            // Need this for testing because TestHelperOz5.sol is exceeding the compiled contract size limit
            allowUnlimitedContractSize: true,
        },
    },
    namedAccounts: {
        deployer: {
            default: 0, // wallet address of index[0], of the mnemonic in .env
        },
    },
    etherscan: {
        apiKey: {
            "sonic-testnet": process.env.SONICSCAN_API_KEY || "",
            "amoy-testnet": process.env.POLYGONSCAN_API_KEY || "",
            "sonic": process.env.SONICSCAN_API_KEY || "",
            "real": "empty",
        },
        customChains: [
            {
                network: "sonic-testnet",
                chainId: 57054,
                urls: {
                    apiURL: "https://api-testnet.sonicscan.org/api",
                    browserURL: "https://testnet.sonicscan.org"
                }
            },
            {
                network: "amoy-testnet",
                chainId: 80002,
                urls: {
                    apiURL: "https://api-amoy.polygonscan.com/api",
                    browserURL: "https://amoy.polygonscan.com"
                }
            },
            {
                network: "sonic",
                chainId: 146,
                urls: {
                    apiURL: "https://api.sonicscan.org/api",
                    browserURL: "https://sonicscan.org"
                }
            },
            {
                network: "real",
                chainId: 111188,
                urls: {
                    apiURL: "https://explorer.re.al/api",
                    browserURL: "https://explorer.re.al"
                }
            }
        ]
    },
    sourcify: {
        // Disabled by default
        // Doesn't need an API key
        enabled: false,
        // Optional: specify a different Sourcify server
        // apiUrl: "https://sourcify.dev/server",
        // Optional: specify a different Sourcify repository
        // browserUrl: "https://repo.sourcify.dev",
    }
}

export default config
