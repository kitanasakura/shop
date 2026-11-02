// ==== specs/site — edit the markdown between the backticks. Don't type a backtick (`) or ${ in your text. ====
SPEC("site", String.raw`
# Site settings
<!-- Global settings. Edit the text after each colon. Image names refer to files in /images/ -->

- name: Fluffy Meadow
- tagline: japanese plushies & more ♡
- logo: logo.png
- announcement: ★ Free shipping on orders over $75! ♡ Holiday orders are open! ★
- currency: $
- footer: © 2026 Fluffy Meadow · A small shop with big love
- order_email: hello@example.com
<!-- Optional: paste a Stripe/PayPal/Shopify payment link to use instead of email checkout -->
- checkout_url:
`);
