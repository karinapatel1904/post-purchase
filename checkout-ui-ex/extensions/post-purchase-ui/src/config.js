/**
 * Configuration for product fetching in post-purchase extension
 */

export const CONFIG = {
  // API Configuration
  API: {
    VERSION: '2023-04',
    TIMEOUT: 5000, // 5 seconds
    BASE_URL: 'https://cultural-customized-car-lights.trycloudflare.com', // Replace with your app URL
    ENDPOINTS: {
      OFFER: '/api/offer',
      SIGN_CHANGESET: '/api/sign-changeset'
    }
  },

  // Product selection strategies
  PRODUCT_SELECTION: {
    // Strategy: 'random' | 'specific' | 'tagged' | 'related'
    STRATEGY: 'random',
    
    // For specific product strategy
    SPECIFIC_PRODUCT_HANDLE: 'the-multi-managed-snowboard',
    
    // For tagged products strategy
    TAGS: ['featured', 'post-purchase'],
    
    // For related products strategy (based on current order)
    RELATED_CATEGORY: 'snowboarding',
    
    // Number of products to fetch for random selection
    MAX_PRODUCTS: 10,
    
    // Sort order for product selection
    SORT_KEY: 'CREATED_AT', // Options: CREATED_AT, TITLE, PRICE, BEST_SELLING, etc.
  },
  
  // Display Configuration
  DISPLAY: {
    SHOW_PRICE: true,
    SHOW_DESCRIPTION: true,
    SHOW_TAGS: false,
    MAX_DESCRIPTION_LENGTH: 150,
  },
  
  // Fallback Configuration
  FALLBACK: {
    ENABLED: true,
    PRODUCT_HANDLE: 'the-multi-managed-snowboard',
  },

  // Offer Configuration
  OFFER: {
    // Whether to use server-side offers or fallback to product fetching
    USE_SERVER_OFFERS: true,
    
    // Fallback offer settings when server is unavailable
    FALLBACK_OFFER: {
      ENABLED: true,
      DISCOUNT_TITLE: 'Special Post-Purchase Price',
      OFFER_ID: 'fallback-offer'
    },

    // UI Configuration
    UI: {
      CALL_TO_ACTION: "It's not too late to add this to your order",
      ACCEPT_BUTTON_TEXT: "Pay now",
      DECLINE_BUTTON_TEXT: "Decline this offer",
      SHOW_PRICE_BREAKDOWN: true,
      SHOW_ORIGINAL_PRICE: true,
      SHOW_DISCOUNTED_PRICE: true
    }
  }
};

/**
 * Product selection strategies
 */
export const PRODUCT_STRATEGIES = {
  RANDOM: 'random',
  SPECIFIC: 'specific', 
  TAGGED: 'tagged',
  RELATED: 'related',
  BEST_SELLING: 'best_selling',
  NEWEST: 'newest',
  PRICE_RANGE: 'price_range'
};

/**
 * GraphQL queries for different product selection strategies
 */
export const QUERIES = {
  // Get a specific product by handle
  SPECIFIC_PRODUCT: (handle) => `
    {
      product(handle: "${handle}") {
        id
        title
        description
        handle
        images(first: 1) {
          edges {
            node {
              url
              altText
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 1) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              availableForSale
            }
          }
        }
        tags
        productType
      }
    }
  `,
  
  // Get random products
  RANDOM_PRODUCTS: (limit = 10, sortKey = 'CREATED_AT') => `
    {
      products(first: ${limit}, sortKey: ${sortKey}) {
        edges {
          node {
            id
            title
            description
            handle
            availableForSale
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                }
              }
            }
            tags
            productType
          }
        }
      }
    }
  `,
  
  // Get products by tags
  TAGGED_PRODUCTS: (tags, limit = 10) => `
    {
      products(first: ${limit}, query: "tag:${tags.join(' AND tag:')}") {
        edges {
          node {
            id
            title
            description
            handle
            availableForSale
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                }
              }
            }
            tags
            productType
          }
        }
      }
    }
  `,
  
  // Get best-selling products
  BEST_SELLING_PRODUCTS: (limit = 10) => `
    {
      products(first: ${limit}, sortKey: BEST_SELLING) {
        edges {
          node {
            id
            title
            description
            handle
            availableForSale
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                }
              }
            }
            tags
            productType
          }
        }
      }
    }
  `
}; 