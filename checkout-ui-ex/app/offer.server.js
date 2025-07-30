const OFFERS = [
  {
    id: 1,
    title: "Post-Purchase Offer",
    productTitle: "Floral White Top",
    productImageURL:
      "https://cdn.shopify.com/s/files/1/0942/0806/5824/files/city-woman-fashion_925x_2x_9d443e4d-9309-43cd-b4e0-d2fa0750910f.jpg?v=1751611408",
    productDescription: ["Stylish sleeveless white top with a floral pattern."],
    originalPrice: "75.00",
    discountedPrice: "63.75",
    changes: [
      {
        type: "add_variant",
        variantID: 50390913351968,
        quantity: 1,
        discount: {
          value: 15,
          valueType: "percentage",
          title: "15% off",
        },
      },
    ],
  },
   {
    id: 2,
    title: "Post-Purchase Offer -- 2",
    productTitle: "Floral White Top - 2",
    productImageURL:
      "https://cdn.shopify.com/s/files/1/0942/0806/5824/files/city-woman-fashion_925x_2x_9d443e4d-9309-43cd-b4e0-d2fa0750910f.jpg?v=1751611408",
    productDescription: ["Stylish sleeveless white top with a floral pattern."],
    originalPrice: "75.00",
    discountedPrice: "63.75",
    changes: [
      {
        type: "add_variant",
        variantID: 50390913351968,
        quantity: 1,
        discount: {
          value: 15,
          valueType: "percentage",
          title: "15% off",
        },
      },
    ],
  },
];


/*
 * For testing purposes, product information is hardcoded.
 * In a production application, replace this function with logic to determine
 * what product to offer to the customer.
 */
export function getOffers() {
  console.log('offers:', OFFERS);
  return OFFERS;
}

/*
 * Retrieve discount information for the specific order on the backend instead of relying
 * on the discount information that is sent from the frontend.
 * This is to ensure that the discount information is not tampered with.
 */
export function getSelectedOffer(offerId) {
  return OFFERS.find((offer) => offer.id === offerId);
}