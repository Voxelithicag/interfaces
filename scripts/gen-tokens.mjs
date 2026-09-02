#!/usr/bin/env node
/**
 * Генерирует src/tokens.ts из конфигурации роутера и проверяет каждый адрес
 * в чейне: symbol() и decimals() должны совпасть с тем, что мы записываем.
 *
 * Так адреса в пакете не могут разойтись с тем, чем роутер реально торгует,
 * и не могут оказаться выдуманными: контракт без кода не пройдёт проверку.
 *
 *   node scripts/gen-tokens.mjs ../../путь/к/app/config.js
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const RPC = process.env.VOX_RPC || "https://rpc.mainnet.chain.robinhood.com";
// Публичная нода отдаёт 403 без браузерного User-Agent.
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/126.0 Safari/537.36";

const SEL = { symbol: "0x95d89b41", decimals: "0x313ce567" };

async function call(to, data) {
  const res = await fetch(RPC, {
    method: "POST",
    headers: { "content-type": "application/json", "user-agent": UA },
    body: JSON.stringify({
      jsonrpc: "2.0", id: 1, method: "eth_call",
      params: [{ to, data }, "latest"],
    }),
  });
  const j = await res.json();
  if (j.error) throw new Error(j.error.message);
  return j.result || "0x";
}

/** Строка в ABI-кодировке: смещение, длина, байты. */
function decodeString(hex) {
  if (!hex || hex.length < 130) return null;
  const b = Buffer.from(hex.slice(2), "hex");
  const len = Number(BigInt("0x" + b.subarray(32, 64).toString("hex")));
  return b.subarray(64, 64 + len).toString("utf8");
}

function parseConfig(path) {
  const txt = readFileSync(path, "utf8");
  const m = txt.match(/export const TOKENS = (\{[\s\S]*?\n\});/);
  if (!m) throw new Error("не нашёл TOKENS в " + path);
  return JSON.parse(m[1]);
}

const configPath = resolve(process.argv[2] || "");
const tokens = parseConfig(configPath);
const rows = [];
let bad = 0;

for (const [sym, meta] of Object.entries(tokens)) {
  const addr = meta.addr;
  let onSym = null, onDec = null;
  try {
    onSym = decodeString(await call(addr, SEL.symbol));
    onDec = Number(BigInt(await call(addr, SEL.decimals)));
  } catch (e) {
    console.error(`  ${sym}: ошибка вызова — ${e.message}`);
  }

  if (onSym === null) {
    console.error(`  ${sym}: ПО АДРЕСУ НЕТ КОНТРАКТА — ${addr}`);
    bad++; continue;
  }
  if (onSym !== sym) {
    console.error(`  ${sym}: символ в чейне «${onSym}» — не совпадает, пропускаю`);
    bad++; continue;
  }
  if (onDec !== meta.decimals) {
    console.error(`  ${sym}: decimals ${onDec} в чейне против ${meta.decimals} в конфиге`);
    bad++; continue;
  }
  rows.push({ symbol: sym, name: meta.name, decimals: onDec, address: addr });
  console.log(`  ${sym.padEnd(6)} ok  ${addr}`);
}

if (bad) {
  console.error(`\nне прошло проверку: ${bad}. Файл не переписан.`);
  process.exit(1);
}

const body = rows
  .map(r => `  ${(r.symbol + ':').padEnd(7)} { symbol: '${r.symbol}', name: ${JSON.stringify(r.name)}, decimals: ${r.decimals}, address: '${r.address}' },`)
  .join("\n");

const out = `// Сгенерировано scripts/gen-tokens.mjs из конфигурации роутера.
// Каждый адрес сверен с чейном ${new Date().toISOString().slice(0, 10)}:
// symbol() и decimals() совпали. Руками не править — перегенерировать.

export interface TokenMeta {
  symbol: string
  name: string
  decimals: number
  address: string
}

export const TOKENS: Record<string, TokenMeta> = {
${body}
}

export const SYMBOLS = Object.keys(TOKENS)

/** Канонический адрес по тикеру. На этом чейне тикер носят и чужие контракты. */
export function addressOf(symbol: string): string | undefined {
  return TOKENS[symbol.toUpperCase()]?.address
}
`;

mkdirSync(resolve(HERE, "../src"), { recursive: true });
writeFileSync(resolve(HERE, "../src/tokens.ts"), out);
console.log(`\nзаписано src/tokens.ts: ${rows.length} токенов, все сверены с чейном`);
