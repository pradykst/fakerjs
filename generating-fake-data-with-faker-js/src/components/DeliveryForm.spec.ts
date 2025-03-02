import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import DeliveryForm from "@/components/DeliveryForm.vue";
import type { ListItem } from "@/types";
import { cleanup, render, type RenderOptions, screen, within } from "@testing-library/vue";
import { userEvent } from "@testing-library/user-event";
import { asCurrency } from "@/helpers";
import { FakerWrapper } from "@/FakerWrapper";

const baseItems: ListItem[] = [
  { quantity: 1, name: "Mouse", priceInCents: 780 },
  { quantity: 2, name: "MousePad", priceInCents: 500 },
  { quantity: 1, name: "Monitor", priceInCents: 14500 },
  { quantity: 3, name: "USB Type C cable", priceInCents: 700 },
];

describe("DeliveryForm", () => {
  beforeEach(() => {
    cleanRender(DeliveryForm, {
      props: {
        initialDetails: { items: baseItems },
      },
    });
  });

  afterEach(() => {
    cleanup();
  });

  describe("Health check on default state", () => {
    test("No warnings are displayed", () => {
      vi.spyOn(console, "warn");
      cleanRender(DeliveryForm);
      expect(console.warn).not.toHaveBeenCalled();
    });

    test("No errors are displayed", () => {
      vi.spyOn(console, "error");
      cleanRender(DeliveryForm);
      expect(console.error).not.toHaveBeenCalled();
    });
  });

  describe("Disables the Finalize Order button if required fields are missing", () => {
    test("Upon rendering, the Finalize Order button is disabled", () => {
      expect(
        screen.getByRole<HTMLButtonElement>("button", {
          name: /finalize order/i,
        }).disabled,
      ).toBe(true);
    });

    test("If all fields are filled, the Finalize Order button is enabled", async () => {
      await filloutAllRecipientInformation();

      expect(
        screen.getByRole<HTMLButtonElement>("button", {
          name: /finalize order/i,
        }).disabled,
      ).toBe(false);
    });

    test.each([
      { fieldName: "Name", label: /name/i },
      { fieldName: "Email", label: /email/i },
      { fieldName: "Street Address", label: /street address/i },
      { fieldName: "City", label: /city/i },
      { fieldName: "Zip/Postal Code", label: /postal code/i },
    ])("$fieldName is required", async ({ fieldName, label }) => {
      await filloutAllRecipientInformation();
      await userEvent.clear(screen.getByRole("textbox", { name: label }));

      expect(
        screen.getByRole<HTMLButtonElement>("button", {
          name: /finalize order/i,
        }).disabled,
      ).toBe(true);
    });

    test("Delivery notes are not required", async () => {
      await filloutAllRecipientInformation();
      await userEvent.clear(screen.getByRole("textbox", { name: /delivery note/i }));

      expect(
        screen.getByRole<HTMLButtonElement>("button", {
          name: /finalize order/i,
        }).disabled,
      ).toBe(false);
    });
  });

  test("Displays the estimated date of delivery", () => {
    const estimatedDeliveryDate = "2020-01-01";
    cleanRender(DeliveryForm, {
      props: {
        initialDetails: { items: baseItems, estimatedDeliveryDate },
      },
    });

    expect(screen.getByText(estimatedDeliveryDate)).toBeDefined();
  });

  describe("Displays a break down of the products being shipped", () => {
    let items: ListItem[] = [];
    const taxesAndFeesRatio = 0.5;

    beforeEach(() => {
      items = [
        { name: "first", quantity: 1, priceInCents: 50 },
        { name: "second", quantity: 2, priceInCents: 100 },
      ];

      cleanRender(DeliveryForm, {
        props: { initialDetails: { items }, taxesAndFeesRatio },
      });
    });

    test("The cost displayed for a given item accounts for the quantity.", async () => {
      let itemNameCell = within(screen.getByRole("table")).getByRole("cell", {
        name: /first/i,
      });
      const expectedPrices = items.map((item) => item.quantity * item.priceInCents);
      expect(itemNameCell.nextElementSibling?.textContent).toContain(asCurrency(expectedPrices[0]));

      itemNameCell = within(screen.getByRole("table")).getByRole("cell", {
        name: /second/i,
      });
      expect(itemNameCell.nextElementSibling?.textContent).toContain(asCurrency(expectedPrices[1]));
    });

    test("The subtotal is the sum of all the item costs.", () => {
      const expectedSubtotal = items
        .map((item) => item.quantity * item.priceInCents)
        .reduce((total, price) => total + price, 0);

      const subtotalNameCell = within(screen.getByRole("table")).getByRole("cell", { name: "Subtotal" });
      expect(subtotalNameCell.nextElementSibling?.textContent).toContain(asCurrency(expectedSubtotal));
    });

    test("Taxes and fees is a percentage of the subtotal, defined in the taxesAndFeesRatio prop.", () => {
      const expectedTaxesAndFees =
        taxesAndFeesRatio *
        items.map((item) => item.quantity * item.priceInCents).reduce((total, price) => total + price, 0);

      const taxesNameCell = within(screen.getByRole("table")).getByRole("cell", { name: "Taxes and Fees" });
      expect(taxesNameCell.nextElementSibling?.textContent).toContain(asCurrency(expectedTaxesAndFees));
    });

    test("Total is the sum of 'subtotal' and 'taxes and fees'.", () => {
      const subtotal = items
        .map((item) => item.quantity * item.priceInCents)
        .reduce((total, price) => total + price, 0);

      const taxesAndFees = subtotal * taxesAndFeesRatio;
      const expectedTotal = subtotal + taxesAndFees;

      const totalNameCell = within(screen.getByRole("table")).getByRole("cell", { name: "Total" });
      expect(totalNameCell.nextElementSibling?.textContent).toContain(asCurrency(expectedTotal));
    });
  });

  describe("Item prices", () => {
    beforeEach(() => {
      vi.spyOn(console, "warn").mockImplementation(() => null);
    });

    test("An item price may be a positive number", async () => {
      const priceInCents = 2000;
      cleanRender(DeliveryForm, {
        props: {
          initialDetails: {
            items: [{ name: "Foobar", quantity: 1, priceInCents }],
          },
        },
      });

      expect(console.warn).not.toHaveBeenCalled();
      expect(await screen.findAllByText(asCurrency(priceInCents), { exact: false })).toBeDefined();
    });

    test("An item price may be 0", async () => {
      cleanRender(DeliveryForm, {
        props: {
          initialDetails: {
            items: [{ name: "Foobar", quantity: 1, priceInCents: 0 }],
          },
        },
      });

      expect(console.warn).not.toHaveBeenCalled();
      expect(await screen.findAllByText(/free/i, { exact: false })).toBeDefined();
    });

    test("A warning is displayed if at least one item has a negative price", () => {
      cleanRender(DeliveryForm, {
        props: {
          initialDetails: {
            items: [{ name: "Foobar", quantity: 1, priceInCents: -100 }],
          },
        },
      });

      expect(console.warn).toHaveBeenCalled();
    });
  });
});

function cleanRender<Component>(component: Component, options?: RenderOptions<Component>) {
  cleanup();
  render(component, options);
}

async function filloutAllRecipientInformation() {
  const fakerWrapper = new FakerWrapper();
  const recipient = fakerWrapper.recipientInformation();

  await userEvent.type(screen.getByRole("textbox", { name: /name/i }), recipient.name);
  await userEvent.type(screen.getByRole("textbox", { name: /email/i }), recipient.email);
  await userEvent.type(screen.getByRole("combobox", { name: /country/i }), recipient.country);
  await userEvent.type(screen.getByRole("textbox", { name: /street address/i }), recipient.streetAddress);
  await userEvent.type(screen.getByRole("textbox", { name: /city/i }), recipient.city);
  await userEvent.type(screen.getByRole("textbox", { name: /state/i }), recipient.stateProvince);
  await userEvent.type(screen.getByRole("textbox", { name: /postal code/i }), recipient.zipPostalCode);

  await userEvent.type(screen.getByRole("textbox", { name: /delivery note/i }), fakerWrapper.additionalNotes());
}
