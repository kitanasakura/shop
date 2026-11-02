// ==== specs/featured — edit the markdown between the backticks. Don't type a backtick (`) or ${ in your text. ====
SPEC("featured", String.raw`
# Featured collection
<!-- Settings first, then one "##" per arch card. "link" is optional (defaults to the shop page) -->

- title: Featured Collection
- subtitle: Cozy picks for a holly jolly season ♡
- icon: 🎄

## Kuromi
- image: featured-kuromi.jpg
- link: /shop.html?item=kuromi-winter-plush

## Cinnamoroll
- image: featured-cinnamoroll.jpg
- link: /shop.html?item=cinnamoroll-santa-plush

## My Melody
- image: featured-mymelody.jpg
- link: /shop.html?item=my-melody-holiday-plush
`);
