// Bulk-korting matrix. Per item-qty.
// 5+ items = 10%, 10+ items = 15%. Server (orders API) en client
// (winkelmand/checkout) gebruiken dezelfde logica.
export const BULK_TIERS = [
  { qty: 10, pct: 15 },
  { qty: 5, pct: 10 },
];

export function unitDiscountPct(qty: number): number {
  for (const t of BULK_TIERS) if (qty >= t.qty) return t.pct;
  return 0;
}

export function lineSubtotalCents(priceCents: number, qty: number): number {
  const pct = unitDiscountPct(qty);
  return Math.round(priceCents * (1 - pct / 100)) * qty;
}

export interface CartLikeItem {
  price_cents: number;
  qty: number;
}

const SHIPPING_FEE_CENTS = 1000; // EUR 10 per bestelling

export function calcTotals(items: CartLikeItem[]) {
  let subtotalRaw = 0;
  let subtotal = 0;
  let savings = 0;
  for (const it of items) {
    subtotalRaw += it.price_cents * it.qty;
    const sub = lineSubtotalCents(it.price_cents, it.qty);
    subtotal += sub;
  }
  savings = subtotalRaw - subtotal;
  // Een magazijn, dus een vast verzendtarief per bestelling.
  const shipping = items.length === 0 ? 0 : SHIPPING_FEE_CENTS;
  const total = subtotal + shipping;
  return { subtotalRaw, subtotal, savings, shipping, total };
}
