// Сгенерировано scripts/gen-tokens.mjs из конфигурации роутера.
// Каждый адрес сверен с чейном 2026-09-02:
// symbol() и decimals() совпали. Руками не править — перегенерировать.

export interface TokenMeta {
  symbol: string
  name: string
  decimals: number
  address: string
}

export const TOKENS: Record<string, TokenMeta> = {
  NVDA:   { symbol: 'NVDA', name: "NVIDIA • Robinhood Token", decimals: 18, address: '0xd0601ce157db5bdc3162bbac2a2c8af5320d9eec' },
  SPY:    { symbol: 'SPY', name: "SPDR S&P 500 ETF Trust • Robinhood Token", decimals: 18, address: '0x117cc2133c37b721f49de2a7a74833232b3b4c0c' },
  AAPL:   { symbol: 'AAPL', name: "Apple • Robinhood Token", decimals: 18, address: '0xaf3d76f1834a1d425780943c99ea8a608f8a93f9' },
  TSM:    { symbol: 'TSM', name: "Taiwan Semiconductor Manufacturing • Robinhood Token", decimals: 18, address: '0x58ffe4a942d3885baa22d7520691f611ef09e7aa' },
  MSTR:   { symbol: 'MSTR', name: "Strategy Inc. • Robinhood Token", decimals: 18, address: '0xec262a75e413fafd0df80480274532c79d42da09' },
  GOOGL:  { symbol: 'GOOGL', name: "Alphabet Class A • Robinhood Token", decimals: 18, address: '0x2e0847e8910a9732eb3fb1bb4b70a580adad4fe3' },
  COIN:   { symbol: 'COIN', name: "Coinbase • Robinhood Token", decimals: 18, address: '0x6330d8c3178a418788df01a47479c0ce7ccf450b' },
  MU:     { symbol: 'MU', name: "Micron Technology • Robinhood Token", decimals: 18, address: '0xff080c8ce2e5feadaca0da81314ae59d232d4afd' },
  TSLA:   { symbol: 'TSLA', name: "Tesla • Robinhood Token", decimals: 18, address: '0x322f0929c4625ed5bad873c95208d54e1c003b2d' },
  META:   { symbol: 'META', name: "Meta Platforms • Robinhood Token", decimals: 18, address: '0xc0d6457c16cc70d6790dd43521c899c87ce02f35' },
  PLTR:   { symbol: 'PLTR', name: "Palantir Technologies • Robinhood Token", decimals: 18, address: '0x894e1ec2d74ffe5aef8dc8a9e84686accb964f2a' },
  QQQ:    { symbol: 'QQQ', name: "Invesco QQQ • Robinhood Token", decimals: 18, address: '0xd5f3879160bc7c32ebb4dc785f8a4f505888de68' },
  AMD:    { symbol: 'AMD', name: "AMD • Robinhood Token", decimals: 18, address: '0x86923f96303d656e4aa86d9d42d1e57ad2023fdc' },
  NFLX:   { symbol: 'NFLX', name: "Netflix • Robinhood Token", decimals: 18, address: '0xe0444ef8bf4ed74f74fd73686e2ddf4c1c5591e8' },
  AMZN:   { symbol: 'AMZN', name: "Amazon • Robinhood Token", decimals: 18, address: '0x12f190a9f9d7d37a250758b26824b97ce941bf54' },
  USDG:   { symbol: 'USDG', name: "USDG", decimals: 6, address: '0x5fc5360d0400a0fd4f2af552add042d716f1d168' },
  WETH:   { symbol: 'WETH', name: "Wrapped Ether", decimals: 18, address: '0x0bd7d308f8e1639fab988df18a8011f41eacad73' },
}

export const SYMBOLS = Object.keys(TOKENS)

/** Канонический адрес по тикеру. На этом чейне тикер носят и чужие контракты. */
export function addressOf(symbol: string): string | undefined {
  return TOKENS[symbol.toUpperCase()]?.address
}
