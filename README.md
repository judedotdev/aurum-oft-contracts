# Aurum

Aurum is decentralized non-custodial lending protocol in Sonic chain based on Aave V3 codebase.

For lending markets we use [aave-v3-core](https://github.com/aave/aave-v3-core) and [aave-v3-periphery](https://github.com/aave/aave-v3-periphery) without changes.

This repository contains the LayerZero OFT token and OFTAdapter contracts.

## OFTAdapter additional setup

In your `hardhat.config.ts` file, add the following configuration to the network you want to deploy the OFTAdapter to:

  ```typescript
  // Replace `0x0` with the address of the ERC20 token you want to adapt to the OFT functionality.
  oftAdapter: {
      tokenAddress: '0x0',
  }
  ```

### 1) Developing Contracts

#### Installing dependencies

We recommend using `pnpm` as a package manager (but you can of course use a package manager of your choice):

```bash
pnpm install
```

#### Compiling your contracts

This project supports both `hardhat` and `forge` compilation. By default, the `compile` command will execute both:

```bash
pnpm compile
```

If you prefer one over the other, you can use the tooling-specific commands:

```bash
pnpm compile:forge
pnpm compile:hardhat
```

Or adjust the `package.json` to for example remove `forge` build:

```diff
- "compile": "$npm_execpath run compile:forge && $npm_execpath run compile:hardhat",
- "compile:forge": "forge build",
- "compile:hardhat": "hardhat compile",
+ "compile": "hardhat compile"
```

#### Running tests

Similarly to the contract compilation, we support both `hardhat` and `forge` tests. By default, the `test` command will execute both:

```bash
pnpm test
```

If you prefer one over the other, you can use the tooling-specific commands:

```bash
pnpm test:forge
pnpm test:hardhat
```

Or adjust the `package.json` to for example remove `hardhat` tests:

```diff
- "test": "$npm_execpath test:forge && $npm_execpath test:hardhat",
- "test:forge": "forge test",
- "test:hardhat": "$npm_execpath hardhat test"
+ "test": "forge test"
```

### 2) Deploying Contracts

Set up deployer wallet/account:

- Rename `.env.example` -> `.env`
- Choose your preferred means of setting up your deployer wallet/account:

```dotenv
MNEMONIC="test test test test test test test test test test test junk"
or...
PRIVATE_KEY="0xabc...def"
```

- Fund this address with the corresponding chain's native tokens you want to deploy to.

To deploy your contracts to your desired blockchains, run the following command in your project's folder:

```bash
npx hardhat lz:deploy
```

More information about available CLI arguments can be found using the `--help` flag:

```bash
npx hardhat lz:deploy --help
```

By following these steps, you can focus more on creating innovative omnichain solutions and less on the complexities of cross-chain communication.

## Sonic deployments

**Aurum** | 0x7f144f8691cba3d2efd8e5bcf042f9303ee31a46 [sonicscan](https://sonicscan.org/address/0x7f144f8691cba3d2efd8e5bcf042f9303ee31a46)

**AggregatorAdapter wS** | 0x83Dd33b8391Fe5cD3B6090C4d698249d9b3631a4 [sonicscan](https://sonicscan.org/address/0x83Dd33b8391Fe5cD3B6090C4d698249d9b3631a4)

**AggregatorAdapter USDC** | 0x4c7505A433905daB0CbE989F0Bb090fDC1B82Dfe [sonicscan](https://sonicscan.org/address/0x4c7505A433905daB0CbE989F0Bb090fDC1B82Dfe)

**AggregatorAdapter WETH** | 0xdD441f6DF25902967D652522807697D9C8360F3A [sonicscan](https://sonicscan.org/address/0xdD441f6DF25902967D652522807697D9C8360F3A)
