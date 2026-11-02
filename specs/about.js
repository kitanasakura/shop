// ==== specs/about — edit the markdown between the backticks. Don't type a backtick (`) or ${ in your text. ====
SPEC("about", String.raw`
# About
<!-- Each "##" becomes a section. Plain lines underneath are paragraphs. Supports **bold**, *italic*, [links](https://example.com) -->

- image: about.jpg

## Our story
Fluffy Meadow started as a tiny shelf of favourite plushies and grew into a cozy little shop.

We bring home **official** Japanese plushies and goods and pack each one with care.

## Shipping
We ship worldwide. Orders over $75 ship free.
`);
