import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateTotal } from "../../../src/cart.js";
test("discount applies to items only", () => {
  const cart = { items: [{ price: 20, quantity: 2 }], shipping: 5 };
  assert.equal(calculateTotal(cart, "SAVE10"), 41.0);
});
test("no code, no discount", () => { assert.equal(calculateTotal({ items: [{ price: 10, quantity: 1 }], shipping: 5 }), 15.0); });
