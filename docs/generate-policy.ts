import { storePolicyTemplate } from "./policy-template";
import {
  refundText,
  deliveryText,
  supportText,
  paymentText,
  buyerInfoText,
} from "./policy-text-map";

interface GenerateStorePolicyProps {
  storeName: string;
  creatorName: string;
  date: string;
  refundPolicy: keyof typeof refundText;
  deliveryMethod: keyof typeof deliveryText;
  supportOption: keyof typeof supportText;
  paymentFinality: keyof typeof paymentText;
  buyerInfo: keyof typeof buyerInfoText;
}

export function generateStorePolicy({
  storeName,
  creatorName,
  date,
  refundPolicy,
  deliveryMethod,
  supportOption,
  paymentFinality,
  buyerInfo,
}: GenerateStorePolicyProps) {
  return storePolicyTemplate
    .replace("{storeName}", storeName)
    .replace("{creatorName}", creatorName)
    .replace("{date}", date)
    .replace("{refundText}", refundText[refundPolicy])
    .replace("{deliveryText}", deliveryText[deliveryMethod])
    .replace("{supportText}", supportText[supportOption])
    .replace("{paymentText}", paymentText[paymentFinality])
    .replace("{buyerInfoText}", buyerInfoText[buyerInfo]);
}
