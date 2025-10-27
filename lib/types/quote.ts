/**
 * ZenQuotes API response type
 * @see https://zenquotes.io/api
 */
export interface ZenQuote {
  /** The quote text */
  q: string;
  /** The author of the quote */
  a: string;
  /** Author image (optional, may not be present in all responses) */
  i?: string;
  /** Character count */
  c?: string;
  /** HTML formatted quote */
  h?: string;
}

/**
 * API response wrapper for quote endpoint
 */
export interface QuoteResponse {
  quote: string;
  author: string;
}
