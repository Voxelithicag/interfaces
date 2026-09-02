#!/usr/bin/env node
/**
 * Сверка адресов пакета с мейннетом.
 *
 * Смысл в том, чтобы расхождение обнаружилось у нас, а не у того, кто поставил
 * пакет и отправил деньги на адрес, где нет контракта. Ровно это и случилось
 * с прошлой версией: все восемь адресов токенов были мёртвыми.
 *
 * Сеть может подвести, поэтому в CI шаг не блокирующий: он сообщает, но не
 * красит сборку красным из-за недоступной ноды.
 */
import {
  TOKENS, SYMBOLS, ROUTER, QUOTER, ROUTER_V4, QUOTER_V4, TREASURY,
} from "../dist/index.js";

const RPC = process.env.VOX_RPC || "https://rpc.mainnet.chain.robinhood.com";
// Публичная нода отвечает 403 без браузерного User-Agent.
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/126.0 Safari/537.36";

async function rpc(method, params) {
  const r = await fetch(RPC, {
    method: "POST",
    headers: { "content-type": "application/json", "user-agent": UA },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const j = await r.json();
  if (j.error) throw new Error(j.error.message);
  return j.result;
}

const decodeString = (hex) => {
  if (!hex || hex.length < 130) return null;
  const b = Buffer.from(hex.slice(2), "hex");
  const len = Number(BigInt("0x" + b.subarray(32, 64).toString("hex")));
  return b.subarray(64, 64 + len).toString("utf8");
};

let bad = 0;

for (const [name, addr] of Object.entries({ ROUTER, QUOTER, ROUTER_V4, QUOTER_V4, TREASURY })) {
  const code = await rpc("eth_getCode", [addr, "latest"]);
  if (!code || code === "0x") {
    console.error(`  ПУСТО  ${name} ${addr}`);
    bad++;
  } else {
    console.log(`  ok     ${name} ${addr} (${(code.length - 2) / 2} байт)`);
  }
}

for (const s of SYMBOLS) {
  const { address, decimals } = TOKENS[s];
  const sym = decodeString(await rpc("eth_call", [{ to: address, data: "0x95d89b41" }, "latest"]));
  if (sym === null) {
    console.error(`  ПУСТО  ${s} ${address} — контракта нет`);
    bad++; continue;
  }
  if (sym !== s) {
    console.error(`  РАСХОД ${s} ${address} — в чейне «${sym}»`);
    bad++; continue;
  }
  const dec = Number(BigInt(await rpc("eth_call", [{ to: address, data: "0x313ce567" }, "latest"])));
  if (dec !== decimals) {
    console.error(`  РАСХОД ${s} decimals ${dec} в чейне против ${decimals} в пакете`);
    bad++; continue;
  }
  console.log(`  ok     ${s.padEnd(6)} ${address}`);
}

if (bad) {
  console.error(`\nрасхождений с чейном: ${bad}`);
  process.exit(1);
}
console.log(`\nвсе ${SYMBOLS.length + 5} адресов совпали с мейннетом`);
