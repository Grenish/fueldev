export const refundText: Record<string, string> = {
  no_refund:
    "Refunds are not offered for digital purchases. Buyers should review product details before completing their order, and creators are expected to provide accurate descriptions.",
  "24_hours":
    "Refunds may be requested within 24 hours of purchase. Creators are required to honor valid requests within this window, and buyers should ensure they request refunds promptly.",
  "3_days":
    "Refunds may be requested within 3 days of purchase. Creators are responsible for processing valid refund requests within this period, and buyers must submit requests within the allowed timeframe.",
  corrupted_only:
    "Refunds are issued only if the purchased file is corrupted or cannot be accessed. Creators must assist with resolving access issues, and buyers should report technical problems as soon as they occur.",
};

export const deliveryText = {
  instant:
    "Products are delivered instantly once payment is completed. Creators must ensure that access links or files are available immediately, and buyers should expect delivery without delay.",
  manual:
    "Products are delivered manually by the creator after purchase. Creators are responsible for providing access within a reasonable timeframe, and buyers may need to wait for the creator to complete delivery.",
  scheduled:
    "Products are delivered on a scheduled or drip based timeline. Creators must release content according to the described schedule, and buyers should expect delivery in stages rather than immediately.",
};

export const supportText = {
  email:
    "Support is provided through email. Creators are expected to respond within a reasonable timeframe, and buyers should use the provided email address for help with access or technical issues.",
  messaging:
    "Support is available through in platform messages. Creators are responsible for checking and responding to messages, and buyers should use this channel for assistance.",
  "24_hours":
    "Support responses are typically provided within 24 hours. Creators must make an effort to respond quickly, and buyers should expect timely communication.",
  "3_days":
    "Support responses are typically provided within 3 days. Creators should reply within this window, and buyers may experience a short delay before receiving a response.",
  none: "This store does not provide support after purchase. Buyers should ensure they can access the product independently, and creators are not required to offer additional assistance.",
};

export const paymentText = {
  final:
    "All payments are final and cannot be reversed. Buyers must review their order before confirming payment, and creators agree that completed payments are not subject to reversal.",
  delivery_fail:
    "Refunds are granted only if the product is not delivered. Creators must fulfill delivery obligations, and buyers must report missing access for a refund to be considered.",
  case_by_case:
    "Refund requests are reviewed on a case by case basis. Creators must evaluate each request fairly, and buyers should provide clear reasons for their request.",
};

export const buyerInfoText = {
  email_only:
    "Only the buyer's email is required to complete the purchase. This is used for processing and delivering access, and creators agree to handle this information responsibly.",
  email_username:
    "The buyer's email and username are required to complete the purchase. This information supports order processing and access management, and creators are expected to protect it.",
  none: "No additional information beyond payment details is required to complete the purchase. Creators rely solely on FuelDev for order processing and do not receive buyer data directly.",
};
