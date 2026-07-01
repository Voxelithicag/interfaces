export interface TokenMeta {
  symbol: string; name: string; decimals: number; address: string
}
export const TOKENS: Record<string, TokenMeta> = {
  USDG:  { symbol: 'USDG',  name: 'USD Greenback',        decimals: 6,  address: '0x5fc5621f79e4a3f20f1c42e7bc2c32ae0fda149a' },
  WETH:  { symbol: 'WETH',  name: 'Wrapped Ether',        decimals: 18, address: '0x4200000000000000000000000000000000000006' },
  SPY:   { symbol: 'SPY',   name: 'SPDR S&P 500 ETF',     decimals: 18, address: '0x8f93d4a6e9fa3fcc829ff1fbfc61e4c653b0bdc4' },
  NVDA:  { symbol: 'NVDA',  name: 'NVIDIA Corporation',    decimals: 18, address: '0xc38a2737ca75f56e1b76ef5694e6e0d4495d00e8' },
  TSLA:  { symbol: 'TSLA',  name: 'Tesla, Inc.',           decimals: 18, address: '0xb3f3fd4b2340ea04597fec04bd2be2acb6e8b6ea' },
  AAPL:  { symbol: 'AAPL',  name: 'Apple Inc.',            decimals: 18, address: '0xb1e1b78cc1d3b1f03aaa20cb9b03c7ff5eaee0ad' },
  AMZN:  { symbol: 'AMZN',  name: 'Amazon.com, Inc.',      decimals: 18, address: '0x16d9d5e3c0e5e15e01efbb0de7dc7001f3cc8f32' },
  COIN:  { symbol: 'COIN',  name: 'Coinbase Global, Inc.', decimals: 18, address: '0x36f5b5b81e51db83ae8e3e8e6f438dead12e21bf' },
}

// updated: iteration 11

// updated: iteration 12

// updated: iteration 16

// updated: iteration 18

// updated: iteration 25
