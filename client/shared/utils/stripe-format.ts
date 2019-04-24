export function toStripeFormat(num) {
  return num * 100;
}

export function fromStripeFormat(num) {
  return num / 100;
}
