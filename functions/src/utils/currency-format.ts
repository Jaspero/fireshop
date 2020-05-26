/**
 * Transforms a stripe value in to a
 * currency formatted number
 */
export function currencyFormat(amount: number, currency: string) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase()
  });

  return formatter.format(amount / 100);
}
