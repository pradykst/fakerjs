import type { DeliveryDetails } from "@/types";
import { reactive } from "vue";

const deliveryDetails = reactive<DeliveryDetails>({
  recipientInformation: {
    name: "",
    email: "",
    country: "United States",
    stateProvince: "",
    city: "",
    streetAddress: "",
    zipPostalCode: "",
  },
  items: [],
  estimatedDeliveryDate: "--",
  additionalNotes: "",
});

export function useDeliveryDetailsState(overwrites?: Partial<DeliveryDetails>) {
  if (overwrites?.items?.some((item) => item.priceInCents < 0)) {
    console.warn("All items must have a value greater or equal to zero.");
  }

  Object.keys(overwrites ?? {}).forEach((key) => {
    if (!overwrites?.[key]) {
      return;
    }

    return (deliveryDetails[key] = overwrites?.[key]);
  });

  return deliveryDetails;
}
