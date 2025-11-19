export type ProductTemplate = {
  name: string;
  description: string;
  price: string;
  type: "digital" | "physical" | "service";
  suggestedPrice?: string;
};

export const productTemplates: Record<string, ProductTemplate> = {
  "digital-product": {
    name: "Download E-Book",
    description:
      "Get instant access to my carefully crafted digital product! 🚀\n\nWhat you’ll receive:\n✓ Instant download right after payment\n✓ Lifetime access + free future updates\n✓ No shipping, no waiting!\n\nInside this pack:\n• High-quality templates / e-book / resources\n• Step-by-step guides & examples\n• Bonus cheat sheets & resources\n\nPerfect for anyone who wants to save time and level up fast. Thousands of creators are already using this!",
    price: "",
    type: "digital",
    suggestedPrice: "599",
  },

  "coaching-call": {
    name: "1-on-1 Mentoring & Strategy Call (60 mins)",
    description:
      "Let’s hop on a call and work on YOUR goals together! 💬\n\nThis is not just another call — it’s 60 minutes of focused, personalized guidance.\n\nYou’ll get:\n✓ Clarity on your biggest challenges\n✓ A clear, actionable roadmap\n✓ Honest feedback & pro tips from my experience\n✓ Recording of the call + detailed follow-up notes\n\nHow it works:\n1. Book your slot\n2. Fill a quick pre-call form (takes 3 mins)\n3. We meet on Google Meet or Zoom\n4. You walk away with confidence and a plan\n\nLimited slots every month — grab yours before they’re gone!",
    price: "",
    type: "service",
    suggestedPrice: "3499",
  },

  membership: {
    name: "Inner Circle Membership",
    description:
      "Welcome to my private community of action-takers! 🌟\n\nWhen you join, you get:\n✓ All my premium courses & templates (past + future)\n✓ Monthly live Q&A + hot-seat coaching\n✓ Private WhatsApp/Telegram group\n✓ Early access to everything I launch\n✓ Exclusive resources, scripts & swipe files\n✓ 1:1 chat support whenever you’re stuck\n\nNo fluff. Just real growth, real support, and real results.\n\nBilled monthly · Cancel anytime with one click · Join 1,200+ happy members today!",
    price: "",
    type: "service",
    suggestedPrice: "999",
  },

  "event-ticket": {
    name: "Live Workshop / Masterclass Ticket",
    description:
      "Grab your seat for this power-packed live workshop! 🎯\n\nWhat’s included:\n✓ 3–4 hours of live, interactive training\n✓ Hands-on exercises & real-time Q&A\n✓ Lifetime replay access\n✓ Workbook + all resources\n✓ Certificate of completion\n✓ Bonus: 30-day post-workshop support\n\nYou’ll walk away knowing exactly how to [main outcome, e.g. “build & launch your first product”, “10x your freelancing income”, etc].\n\nSeats are limited — once they’re gone, they’re gone!",
    price: "",
    type: "service",
    suggestedPrice: "1999",
  },

  "custom-item": {
    name: "",
    description: "",
    price: "",
    type: "digital",
    suggestedPrice: "",
  },
};

export const getTemplateByType = (type: string): ProductTemplate => {
  return (
    productTemplates[type.toLowerCase().replace(/\s+/g, "-")] ||
    productTemplates["custom-item"]
  );
};
