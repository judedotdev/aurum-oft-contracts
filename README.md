# Aurum

Aurum is decentralized non-custodial lending protocol in Sonic chain based on Aave V3 codebase.

For lending markets we use [aave-v3-core](https://github.com/aave/aave-v3-core) and [aave-v3-periphery](https://github.com/aave/aave-v3-periphery) without changes.

This repository contains tokenomics related contracts and oracle adapters.

## Dev

```shell
forge build
forge test
forge coverage
```

## Sonic deployments

**Aurum** | 0x7f144f8691cba3d2efd8e5bcf042f9303ee31a46 [sonicscan](https://sonicscan.org/address/0x7f144f8691cba3d2efd8e5bcf042f9303ee31a46)

**AggregatorAdapter wS** | 0x83Dd33b8391Fe5cD3B6090C4d698249d9b3631a4 [sonicscan](https://sonicscan.org/address/0x83Dd33b8391Fe5cD3B6090C4d698249d9b3631a4)

**AggregatorAdapter USDC** | 0x4c7505A433905daB0CbE989F0Bb090fDC1B82Dfe [sonicscan](https://sonicscan.org/address/0x4c7505A433905daB0CbE989F0Bb090fDC1B82Dfe)

**AggregatorAdapter WETH** | 0xdD441f6DF25902967D652522807697D9C8360F3A [sonicscan](https://sonicscan.org/address/0xdD441f6DF25902967D652522807697D9C8360F3A)
