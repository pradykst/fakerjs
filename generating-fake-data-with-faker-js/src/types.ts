import type Settings from "@/settings";

export type ListItem = {
  quantity: number;
  name: string;
  priceInCents: number;
};

export type SupportedCountry = (typeof Settings.COUNTRIES)[number];

export type RecipientInformation = {
  name: string;
  email: string;
  country: SupportedCountry;
  stateProvince: string;
  city: string;
  streetAddress: string;
  zipPostalCode: string;
};

export type ItemsForDelivery = {
  items: ListItem[];
};

export type DeliveryDetails = {
  recipientInformation: RecipientInformation;
  additionalNotes: string;
  estimatedDeliveryDate: string;
  items: ListItem[];
};
