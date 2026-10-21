import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import * as api from "../dist/index.js";
test("expiry boundary", () => {
  let now = 0;
  const c = new api.MemoryCache(2, () => now);
  c.set("a", 1, 10);
  assert.equal(c.get("a"), 1);
  now = 10;
  assert.equal(c.has("a"), false);
  assert.equal(c.size, 0);
});
test("FIFO capacity", () => {
  const c = new api.MemoryCache(1);
  c.set("a", 1, 1000);
  c.set("b", 2, 1000);
  assert.equal(c.has("a"), false);
  assert.equal(c.get("b"), 2);
});
test("stored undefined still present", () => {
  const c = new api.MemoryCache();
  c.set("x", undefined, 1000);
  assert.equal(c.has("x"), true);
  c.clear();
  assert.equal(c.size, 0);
});
