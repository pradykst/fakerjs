import type { ListItem, RecipientInformation } from "@/types";
import { Faker, faker, fakerEN_CA, fakerFR, fakerPT_BR } from "@faker-js/faker";
import Settings from "@/settings";
import { faker_MiddleEarth } from "@/faker-middle-earth";

export class FakerWrapper {
  additionalNotes(): string {
    return faker.lorem.paragraph();
  }

  estimatedDeliveryDate(): string {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "long",
    }).format(new Date());
  }

  items(): ListItem[] {
    return [
      { quantity: 1, name: "Mouse", priceInCents: 780 },
      { quantity: 2, name: "MousePad", priceInCents: 500 },
      { quantity: 1, name: "Monitor", priceInCents: 14500 },
      { quantity: 3, name: "USB Type C cable", priceInCents: 700 },
    ];
  }

  recipientInformation(): RecipientInformation {
    const country = faker.helpers.arrayElement(Settings.COUNTRIES);
    const localFaker = this.localFaker(country);

    return {
      name: localFaker.person.fullName(),
      email: localFaker.internet.email(),
      country: country,
      stateProvince: localFaker.location.state(),
      city: localFaker.location.city(),
      streetAddress: localFaker.location.streetAddress({ useFullAddress: true }),
      zipPostalCode: localFaker.location.zipCode(),
    };
  }

  private localFaker(country: string): Faker {
    return (
      {
        Brazil: fakerPT_BR,
        Canada: fakerEN_CA,
        France: fakerFR,
        "United States": faker,
        "Middle-earth": faker_MiddleEarth,
      }[country] ?? faker
    );
  }
}
