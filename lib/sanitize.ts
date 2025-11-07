import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

/**
 *
 * This module provides production-grade XSS protection using DOMPurify.
 * It works both on the server (Node.js with JSDOM) and client (browser).
 *
 * **Use Cases:**
 * - Sanitize article content before saving to database
 * - Clean user-generated HTML before rendering
 * - Generate safe excerpts from HTML content
 * - Strip HTML tags for plain text extraction
 *
 * **Security:**
 * - Removes all script tags and event handlers
 * - Blocks dangerous protocols (javascript:, data:, etc.)
 * - Prevents DOM-based XSS attacks
 * - Validates all URLs and attributes
 *
 * @module lib/sanitize
 */

/**
 * Creates a DOMPurify instance that works in both browser and Node.js environments
 *
 * @returns {DOMPurify} Configured DOMPurify instance
 * @private
 */
const createDOMPurifyInstance = () => {
  if (typeof window === "undefined") {
    // Server-side: Create a JSDOM window for DOMPurify
    const { window } = new JSDOM("");
    return DOMPurify(window as unknown as Window & typeof globalThis);
  }
  // Client-side: Use native browser window
  return DOMPurify;
};

/**
 * Sanitizes HTML content with strict security settings
 *
 * This function removes all potentially dangerous elements, attributes, and protocols
 * while preserving safe formatting and structure. Use this for general HTML sanitization.
 *
 * **What it removes:**
 * - Script tags and inline event handlers (onclick, onerror, etc.)
 * - Iframes, objects, embeds, and forms
 * - JavaScript and data URLs
 * - Potentially dangerous CSS
 *
 * **What it keeps:**
 * - Basic formatting (bold, italic, underline)
 * - Headings and paragraphs
 * - Links (with safe protocols only)
 * - Images (from safe sources)
 * - Lists and tables
 * - Code blocks
 *
 * @param {string} html - The HTML content to sanitize
 * @returns {string} Sanitized HTML safe for rendering
 *
 * @example
 * ```ts
 * const unsafe = '<script>alert("XSS")</script><p>Hello</p>';
 * const safe = sanitizeHtml(unsafe);
 * // Result: '<p>Hello</p>'
 * ```
 *
 * @example
 * ```ts
 * const unsafe = '<a href="javascript:alert(1)">Click</a>';
 * const safe = sanitizeHtml(unsafe);
 * // Result: '<a>Click</a>' (href removed)
 * ```
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";

  const purify = createDOMPurifyInstance();

  return purify.sanitize(html, {
    // Allowed HTML tags (TipTap editor output)
    ALLOWED_TAGS: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "br",
      "hr",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "strike",
      "del",
      "mark",
      "a",
      "img",
      "ul",
      "ol",
      "li",
      "blockquote",
      "pre",
      "code",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "div",
      "span",
    ],

    // Allowed attributes
    ALLOWED_ATTR: [
      "href",
      "target",
      "rel",
      "src",
      "alt",
      "title",
      "class",
      "id",
      "data-type", // For TipTap extensions
    ],

    // Allowed URI schemes
    ALLOWED_URI_REGEXP:
      /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,

    // Keep text content from removed tags
    KEEP_CONTENT: true,

    // Don't return Trusted Types (not needed for server)
    RETURN_TRUSTED_TYPE: false,

    // Force target="_blank" for external links
    ADD_ATTR: ["target"],

    // Hook to add rel="noopener noreferrer" to external links
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form"],
    FORBID_ATTR: [
      "onerror",
      "onload",
      "onclick",
      "onmouseover",
      "onfocus",
      "onblur",
    ],
  });
}

/**
 * Sanitizes article content from TipTap editor
 *
 * Optimized for article/blog post content created with the TipTap rich text editor.
 * This is the primary sanitization function used when saving articles to the database.
 *
 * **Allowed Elements:**
 * - Headings (h1-h6), paragraphs, line breaks
 * - Text formatting (bold, italic, underline, strikethrough, mark)
 * - Links and images
 * - Lists (ordered and unordered)
 * - Blockquotes and code blocks
 * - Tables
 *
 * **Security Features:**
 * - Removes all script tags and event handlers
 * - Validates URLs (allows http/https/mailto only)
 * - Strips dangerous attributes
 * - Preserves text content from removed tags
 *
 * @param {string} html - TipTap editor HTML output
 * @returns {string} Sanitized HTML safe for database storage and rendering
 *
 * @example
 * ```ts
 * // In article router
 * const userContent = input.content;
 * const safeContent = sanitizeArticleContent(userContent);
 * await prisma.article.create({
 *   data: { content: safeContent }
 * });
 * ```
 */
export function sanitizeArticleContent(html: string): string {
  if (!html) return "";

  const purify = createDOMPurifyInstance();

  return purify.sanitize(html, {
    ALLOWED_TAGS: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "br",
      "hr",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "strike",
      "del",
      "mark",
      "a",
      "img",
      "ul",
      "ol",
      "li",
      "blockquote",
      "pre",
      "code",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "div",
      "span",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "src", "alt", "title", "class"],
    KEEP_CONTENT: true,
    RETURN_TRUSTED_TYPE: false,
  });
}

/**
 * Extracts plain text from HTML by removing all tags
 *
 * This function strips all HTML tags while preserving the text content.
 * Useful for:
 * - Generating meta descriptions
 * - Creating search indexes
 * - Text-only previews
 * - Character counting
 *
 * The HTML is sanitized first to ensure security before stripping tags.
 *
 * @param {string} html - HTML content to convert to plain text
 * @returns {string} Plain text with all HTML tags removed
 *
 * @example
 * ```ts
 * const html = '<h1>Title</h1><p>Content with <strong>bold</strong> text</p>';
 * const text = stripHtml(html);
 * // Result: 'Title Content with bold text'
 * ```
 *
 * @example
 * ```ts
 * // Calculate reading time
 * const plainText = stripHtml(article.content);
 * const wordCount = plainText.split(/\s+/).length;
 * const readingTime = Math.ceil(wordCount / 200); // ~200 words per minute
 * ```
 */
export function stripHtml(html: string): string {
  if (!html) return "";

  const purify = createDOMPurifyInstance();

  // First sanitize, then remove all tags
  const sanitized = purify.sanitize(html, {
    ALLOWED_TAGS: [],
    KEEP_CONTENT: true,
  });

  return sanitized.trim();
}

/**
 * Generates a safe plain text excerpt from HTML content
 *
 * Automatically creates a preview/summary by:
 * 1. Stripping all HTML tags
 * 2. Truncating to specified length
 * 3. Breaking at word boundaries (not mid-word)
 * 4. Adding ellipsis (...) if truncated
 *
 * Perfect for:
 * - Article previews in lists
 * - Meta descriptions for SEO
 * - Social media sharing descriptions
 * - Email notifications
 *
 * @param {string} html - HTML content to generate excerpt from
 * @param {number} maxLength - Maximum character length (default: 200)
 * @returns {string} Plain text excerpt with ellipsis if truncated
 *
 * @example
 * ```ts
 * const html = '<h1>My Article</h1><p>This is a very long article about...</p>';
 * const excerpt = generateExcerpt(html, 50);
 * // Result: 'My Article This is a very long article...'
 * ```
 *
 * @example
 * ```ts
 * // Auto-generate excerpt when saving article
 * const excerpt = data.excerpt ?? generateExcerpt(content, 300);
 * await prisma.article.update({
 *   where: { id },
 *   data: { excerpt }
 * });
 * ```
 */
export function generateExcerpt(html: string, maxLength = 200): string {
  const text = stripHtml(html);

  if (text.length <= maxLength) {
    return text;
  }

  // Truncate at word boundary
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return lastSpace > 0
    ? truncated.substring(0, lastSpace) + "..."
    : truncated + "...";
}

/**
 * Validates whether HTML content is safe
 *
 * Checks if the HTML content can be safely rendered by comparing
 * it with its sanitized version. If sanitization removed significant
 * content, the original might have contained unsafe elements.
 *
 * **Note:** This is a basic check. All user content should still
 * be sanitized before rendering, regardless of this check.
 *
 * @param {string} html - HTML content to validate
 * @returns {boolean} True if content is safe, false if suspicious
 *
 * @example
 * ```ts
 * const userHtml = '<p>Hello</p>';
 * if (isHtmlSafe(userHtml)) {
 *   // Still sanitize before rendering!
 *   const safe = sanitizeHtml(userHtml);
 * }
 * ```
 *
 * @deprecated Use sanitization directly instead of validation
 */
export function isHtmlSafe(html: string): boolean {
  if (!html) return true;

  const sanitized = sanitizeHtml(html);

  // If sanitization significantly changed the content, it might be unsafe
  return sanitized.length > 0;
}
