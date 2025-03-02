export function asCurrency(costInCents: number, currencyCode: string = "USD", locale: string = "en-US") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  })
    .format(costInCents / 100)
    .replace(/\s+/g, " ");
}
