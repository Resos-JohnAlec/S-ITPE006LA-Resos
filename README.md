# FORM — T-shirt storefront

A complete frontend student project built with HTML, CSS, and vanilla JavaScript.

## Run

Open `index.html` in a browser. For consistent localStorage behavior between pages, use a local static server such as VS Code Live Server, and open `index.html` through that server. No build step or application dependencies are required.

## Included

- Ten products in a five-column, two-row desktop grid (three columns on tablets, two on smaller screens, and one on narrow phones), filters, product dialogs, size charts, and quantity selectors.
- Cart with size changes, quantity changes, removals, totals, and localStorage persistence.
- Buy Now requires a size and adds that item to the current bag before opening checkout.
- Five checkout steps: customer, shipping, review, simulated payment, confirmation.
- Inline validation for required fields, email, Philippine mobile numbers, and four-digit postal codes.
- Standard shipping of ₱120; free shipping for a merchandise subtotal of ₱2,000 or more.
- Accessible sliding dark-mode switch on both pages, with a locally bundled Font Awesome moon icon, saved locally; follows your system theme until you choose a preference.
- Keyboard-accessible native dialogs, mobile navigation, reduced-motion support, and printable confirmations.

## Files and customization

- `js/products.js`: product catalog, prices, descriptions, and sizes.
- `js/theme.js`: shared theme toggle and preference persistence.
- `js/cart.js`: cart state and persistence.
- `js/main.js`: storefront, product dialogs, filters, cart, and mobile navigation.
- `js/checkout.js`: checkout steps, validation, and confirmation.
- `css/style.css`: responsive styles.
- `images/product-images/`: original local SVG T-shirt illustrations.
- `images/hero.svg`: original local hero illustration.
- `generate-assets.js`: optional Node.js script to recreate the illustrations. Run from the project root with `node generate-assets.js`. Node is not needed to use the website.
- `test-store.js`: dependency-free logic checks. Run `node test-store.js` to verify cart operations, persistence, shipping rules, field validation, and order confirmation. These checks use a minimal DOM substitute and do not replace testing layouts and interactions in a browser.

Product and hero images are original illustrations included with this project. The theme switch uses the Font Awesome Free moon icon; attribution and license links are in `images/icons/README.md`. An external photo download was unavailable. You can replace the catalog image paths with your own product photos. Google Fonts is optional; local system fonts are used when offline. The site otherwise uses local assets.

The brand, email address, social destinations, products, and orders are demonstration content. No real payments, accounts, fulfillment, or confirmation emails are implemented. Customer details remain in memory and are discarded on refresh; only the cart is stored locally. A confirmed order clears the bag. Print the confirmation before leaving if you want to keep it.
