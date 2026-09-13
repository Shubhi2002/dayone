import { discountPercent } from "./discounts.js";

export function shippingFor(cart) { return cart.shipping ?? 0; }
export function roundToCents(n) { return Math.round(n * 100) / 100; }

export function calculateTotal(cart, discountCode) {
  let total = 0;
  for (const item of cart.items) total += item.price * item.quantity;
  total += shippingFor(cart);            // shipping added here
  if (discountCode) {
    const pct = discountPercent(discountCode);
    total = total * (1 - pct / 100);      // discount applied to everything
  }
  return roundToCents(total);
}
