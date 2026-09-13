import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateTotal } from "../src/cart.js";
test("adds up items", () => assert.equal(calculateTotal({ items: [{ price: 10, quantity: 2 }], shipping: 0 }), 20));
test("adds shipping", () => assert.equal(calculateTotal({ items: [{ price: 10, quantity: 1 }], shipping: 5 }), 15));
test("applies discount to items only, not shipping", () => assert.equal(calculateTotal({ items: [{ price: 20, quantity: 2 }], shipping: 5 }, "SAVE10"), 41));
test("ignores an unknown discount code", () => assert.equal(calculateTotal({ items: [{ price: 10, quantity: 1 }], shipping: 0 }, "NOPE"), 10));
