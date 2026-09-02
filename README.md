# voxelithic-interfaces

TypeScript types, contract ABIs and verified addresses for Voxelithic on Robinhood Chain (4663).

## Install

```bash
npm install voxelithic-interfaces
```

## Usage

```typescript
import {
  CHAIN_ID, ROUTER, QUOTER, ROUTER_V4, QUOTER_V4,
  TOKENS, SYMBOLS, addressOf,
  VoxRouterABI,
} from 'voxelithic-interfaces'

addressOf('NVDA')     // 0xd0601ce157db5bdc3162bbac2a2c8af5320d9eec
TOKENS.USDG.decimals  // 6
CHAIN_ID              // 4663
```

## Why `addressOf` matters

On this chain a ticker is not an identifier. 39 contracts answer to a stock
symbol that is not theirs, and one of them holds more than half a million
dollars of liquidity while trading two cents a day. Resolving a symbol by
searching an indexer will eventually hand you the wrong address.

`TOKENS` is generated from the router's own configuration and every entry is
checked against the chain before it is written: `symbol()` and `decimals()`
must match, and an address with no contract fails the build. So the addresses
in this package cannot drift from the ones the router actually trades.

The full picture of what else carries these tickers is at
[voxelithic.xyz/registry](https://voxelithic.xyz/registry), machine readable at
[/tokens.json](https://voxelithic.xyz/tokens.json).

## Exports

| Export | What it is |
|---|---|
| `CHAIN_ID` | 4663 |
| `ROUTER`, `QUOTER` | Uniswap v3 style venues, deployed and verified |
| `ROUTER_V4`, `QUOTER_V4` | Uniswap v4 singleton branch |
| `UNISWAP_V4_SINGLETON` | the v4 pool manager |
| `TOKENS`, `SYMBOLS`, `addressOf` | canonical token set |
| `VoxRouterABI`, `VoxQuoterABI`, `VoxRouterV4ABI`, `VoxQuoterV4ABI` | ABIs taken from the Foundry build artifacts, not retyped |
| `Hop`, `Route`, `Quote`, `PoolKey` | request and response shapes |

## Regenerating the token set

```bash
node scripts/gen-tokens.mjs /path/to/app/config.js
```

Every address is verified against mainnet as it is written. The script exits
non-zero and leaves the file untouched if anything fails.

## Contracts

| Contract | Address |
|---|---|
| VoxRouter | `0x87cD7EbE8c213455e5e5a8554657D5f294a82e64` |
| VoxQuoter | `0x9616627E871c96e38cb21b9551F62Ed93366bE1B` |
| VoxRouterV4 | `0x290b9b46308f7a3B80A5F62214B426d3bfAfaab5` |
| VoxQuoterV4 | `0x5858F06894623eF4862103A747074E5AA3436d4F` |

All four are verified on
[Blockscout](https://robinhoodchain.blockscout.com/address/0x87cD7EbE8c213455e5e5a8554657D5f294a82e64).

## License

MIT
