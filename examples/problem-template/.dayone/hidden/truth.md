Shipping is added to `total` before the percentage discount is applied in `calculateTotal`, so the discount also reduces shipping. Fix: apply the discount to the item subtotal, then add shipping.
