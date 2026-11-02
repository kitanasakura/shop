// ==== specs/nav — edit the markdown between the backticks. Don't type a backtick (`) or ${ in your text. ====
SPEC("nav", String.raw`
# Navigation
<!-- One "##" per menu link. "dropdown: categories" adds a menu built from categories.md -->

## Home
- url: /

## Shop
- url: /shop.html
- dropdown: categories

## About
- url: /about.html

## Journal
- url: /journal.html

## Contact
- url: /contact.html
`);
