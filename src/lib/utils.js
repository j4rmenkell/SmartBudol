import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getBestPrice(products) {
  return Math.min(...products.map((p) => p.price));
}

export function getFastestDelivery(products) {
  const order = ['1–2 days', '2–3 days', '3–5 days', '4–7 days'];
  for (const label of order) {
    if (products.some((p) => p.deliveryDays === label)) return label;
  }
  return null;
}

export function formatPrice(n) {
  return '₱' + n.toLocaleString('en-PH');
}