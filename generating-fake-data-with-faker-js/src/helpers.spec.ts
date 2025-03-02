import { describe, expect, test } from "vitest";
import { asCurrency } from "@/helpers";

describe("asCurrency", () => {
  test.each([
    { given: 50, expected: "$0.50" },
    { given: 140, expected: "$1.40" },
    { given: 512312312300, expected: "$5,123,123,123.00" },
    { given: -1042, expected: "-$10.42" },
  ])("it displays $given as $expected", ({ given, expected }) => {
    expect(asCurrency(given)).toEqual(expected);
  });

  describe("Support of different currencies", () => {
    test.each([
      { currency: "USD", locale: "en-US", expectation: "$1,000,000.00" },
      { currency: "BRL", locale: "pt-BR", expectation: "R$ 1.000.000,00" },
      { currency: "BRL", locale: "en-US", expectation: "R$1,000,000.00" },
      { currency: "EUR", locale: "de-DE", expectation: "1.000.000,00 €" },
      { currency: "EUR", locale: "en-US", expectation: "€1,000,000.00" },
      { currency: "INR", locale: "en-IN", expectation: "₹10,00,000.00" },
      { currency: "INR", locale: "en-US", expectation: "₹1,000,000.00" },
    ])("$currency currency in $locale locale", ({ currency, locale, expectation }) => {
      expect(asCurrency(1e8, currency, locale)).toEqual(expectation);
    });
  });
});
