#!/usr/bin/env node
/**
 * Проверка собранного пакета, а не исходников.
 *
 * Импорт идёт из dist ровно так, как это сделает установивший: тут ловится
 * класс поломок, невидимых для tsc. Так нашлось, что ESM-сборка без явных
 * расширений в импортах падает у пользователя с ERR_MODULE_NOT_FOUND, хотя
 * компилируется без единой ошибки.
 */
import assert from "node:assert/strict";
import {
  CHAIN_ID, ROUTER, QUOTER, ROUTER_V4, QUOTER_V4,
  TOKENS, SYMBOLS, addressOf,
  VoxRouterABI, VoxQuoterABI,
} from "../dist/index.js";

const isAddress = (a) => /^0x[0-9a-fA-F]{40}$/.test(a);
let n = 0;
const ok = (name, fn) => { fn(); n++; console.log(`  ok  ${name}`); };

ok("chain id", () => assert.equal(CHAIN_ID, 4663));

ok("адреса контрактов имеют верный вид", () => {
  for (const a of [ROUTER, QUOTER, ROUTER_V4, QUOTER_V4]) assert.ok(isAddress(a), a);
});

ok("токены не пусты и все адреса валидны", () => {
  assert.ok(SYMBOLS.length > 0);
  for (const s of SYMBOLS) {
    const t = TOKENS[s];
    assert.ok(isAddress(t.address), `${s}: ${t.address}`);
    assert.equal(t.symbol, s);
    assert.ok(Number.isInteger(t.decimals) && t.decimals >= 0 && t.decimals <= 18);
  }
});

ok("адреса токенов уникальны", () => {
  const seen = new Set();
  for (const s of SYMBOLS) {
    const a = TOKENS[s].address.toLowerCase();
    assert.ok(!seen.has(a), `дубль адреса у ${s}`);
    seen.add(a);
  }
});

ok("addressOf не зависит от регистра", () => {
  assert.equal(addressOf("nvda"), TOKENS.NVDA.address);
  assert.equal(addressOf("NVDA"), TOKENS.NVDA.address);
  assert.equal(addressOf("нет такого"), undefined);
});

ok("USDG с шестью знаками", () => assert.equal(TOKENS.USDG.decimals, 6));

ok("в ABI есть точки входа роутера и квотера", () => {
  const names = VoxRouterABI.map((e) => e.name);
  for (const f of ["swapExactIn", "feeBps", "owner", "pendingOwner"]) {
    assert.ok(names.includes(f), `нет ${f}`);
  }
  assert.ok(VoxRouterABI.some((e) => e.type === "error" && e.name === "VoxSlippage"));
  assert.ok(VoxQuoterABI.length > 0);
});

console.log(`\n${n} проверок пройдено`);
