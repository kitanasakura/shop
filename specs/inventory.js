// ==== specs/inventory — edit the markdown between the backticks. Don't type a backtick (`) or ${ in your text. ====
SPEC("inventory", String.raw`
# Inventory
<!--
HOW TO ADD A PRODUCT: copy one block below, paste it at the bottom, edit it. That's it.

  ## Product name                  <- required, also becomes the item's link (kuromi-winter-plush)
  - price: 34.00                   <- required, number only
  - category: Sanrio               <- must match a title in categories.md (new ones also work)
  - images: a.jpg, b.jpg           <- files you uploaded to /images/ (first = main photo)
  - badge: New                     <- optional ribbon (New, Sale, Limited...)
  - stock: in                      <- "in" or "out"  (out = shows Sold out)
  - description: One-line text.    <- optional

Images can also be full URLs (https://...).
-->

## Cinnamoroll Santa Plush
- price: 34.00
- category: Cinnamoroll
- images: cinnamoroll-1.jpg, cinnamoroll-2.jpg
- badge: New
- stock: in
- description: Soft and fluffy Cinnamoroll in a tiny Santa hat. About 25 cm tall.

## Kuromi Winter Plush
- price: 36.00
- category: Sanrio
- images: kuromi-1.jpg
- stock: in
- description: Kuromi in a cozy plaid beanie, holding a gingerbread friend.

## My Melody Holiday Plush
- price: 32.00
- category: My Melody
- images: mymelody-1.jpg
- badge: Limited
- stock: in
- description: My Melody in a red holiday hood with her teddy.

## Pompompurin Sleepy Plush
- price: 38.00
- category: Pompompurin
- images: pompompurin-1.jpg
- stock: out
- description: Pompompurin snoozing in a Santa hat.
`);
