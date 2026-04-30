export interface Hop { pool: string; tokenIn: string; tokenOut: string; kind: number }
export interface Route { hops: Hop[]; amountIn: bigint; minOut: bigint; family: 'v3' | 'v4' }
export interface Quote { amountOut: bigint; hops: Hop[]; venue: string; price: number }
export interface PoolKey { currency0: string; currency1: string; fee: number; tickSpacing: number; hooks: string }
