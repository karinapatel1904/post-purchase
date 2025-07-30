const OFFERS = [
  {
    id: 1,
    title: "Post-Purchase Offer",
    productTitle: "Floral White Top",
    productImageURL:
      "",
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