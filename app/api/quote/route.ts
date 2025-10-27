import { NextResponse } from "next/server";
import type { ZenQuote, QuoteResponse } from "@/lib/types/quote";

export async function GET() {
  try {
    const res = await fetch("https://zenquotes.io/api/today", {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      throw new Error(`ZenQuotes API error: ${res.status}`);
    }

    const data: ZenQuote[] = await res.json();

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "No quote available" },
        { status: 404 },
      );
    }

    const zenQuote = data[0];

    // Transform to a cleaner response format
    const response: QuoteResponse = {
      quote: zenQuote.q,
      author: zenQuote.a,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching quote:", error);
    return NextResponse.json(
      { error: "Failed to fetch quote" },
      { status: 500 },
    );
  }
}
