const CODES = { SAVE10: 10, SAVE20: 20 };
export function discountPercent(code) { return CODES[code] ?? 0; }
