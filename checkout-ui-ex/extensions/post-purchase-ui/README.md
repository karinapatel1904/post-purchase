# Post-Purchase UI Extension - Product Fetching

This extension demonstrates how to fetch and display products in a Shopify post-purchase UI using the Storefront API.

## Features

- **Multiple Product Selection Strategies**: Random, specific, tagged, best-selling
- **Configurable Display Options**: Show/hide price, description, tags
- **Robust Error Handling**: Fallback products and graceful degradation
- **Environment-Based Configuration**: Secure API token management
- **Responsive Design**: Works across different device sizes

## Product Selection Strategies

### 1. Random Products (`random`)
Fetches a random product from your store's catalog.

```javascript
// In config.js
PRODUCT_SELECTION: {
  STRATEGY: 'random',
  MAX_PRODUCTS: 10,
  SORT_KEY: 'CREATED_AT'
}
```

### 2. Specific Product (`specific`)
Fetches a specific product by handle.

```javascript
PRODUCT_SELECTION: {
  STRATEGY: 'specific',
  SPECIFIC_PRODUCT_HANDLE: 'my-product-handle'
}
```

### 3. Tagged Products (`tagged`)
Fetches products with specific tags.

```javascript
PRODUCT_SELECTION: {
  STRATEGY: 'tagged',
  TAGS: ['featured', 'post-purchase']
}
```

### 4. Best-Selling Products (`best_selling`)
Fetches your best-selling products.

```javascript
PRODUCT_SELECTION: {
  STRATEGY: 'best_selling',
  MAX_PRODUCTS: 5
}
```

## Configuration

Edit `src/config.js` to customize the extension behavior:

### Product Selection
```javascript
PRODUCT_SELECTION: {
  STRATEGY: 'random', // 'random' | 'specific' | 'tagged' | 'best_selling'
  SPECIFIC_PRODUCT_HANDLE: 'the-multi-managed-snowboard',
  TAGS: ['featured', 'post-purchase'],
  MAX_PRODUCTS: 10,
  SORT_KEY: 'CREATED_AT' // 'CREATED_AT' | 'TITLE' | 'PRICE' | 'BEST_SELLING'
}
```

### Display Options
```javascript
DISPLAY: {
  SHOW_PRICE: true,
  SHOW_DESCRIPTION: true,
  SHOW_TAGS: false,
  MAX_DESCRIPTION_LENGTH: 150
}
```

### Fallback Configuration
```javascript
FALLBACK: {
  ENABLED: true,
  PRODUCT_HANDLE: 'the-multi-managed-snowboard'
}
```

## Environment Variables

For production, set these environment variables:

```bash
SHOPIFY_STOREFRONT_ACCESS_TOKEN=615017401a1387c62295aff78f558592
SHOPIFY_SHOP_DOMAIN=dev-checkout-functions.myshopify.com
```

## Setup Instructions

1. **Get Storefront Access Token**:
   - Go to your Shopify admin
   - Navigate to Settings > Apps and sales channels > Develop apps
   - Create a new app or use existing one
   - Go to API credentials > Storefront API
   - Generate a new access token

2. **Update Configuration**:
   - Edit `src/config.js` to set your preferred product selection strategy
   - Update the shop domain and access token

3. **Deploy the Extension**:
   ```bash
   npm run build
   shopify app deploy
   ```

## Customization Examples

### Show Only Best-Selling Products
```javascript
// In config.js
PRODUCT_SELECTION: {
  STRATEGY: 'best_selling',
  MAX_PRODUCTS: 3
}
```

### Show Products with Specific Tags
```javascript
// In config.js
PRODUCT_SELECTION: {
  STRATEGY: 'tagged',
  TAGS: ['sale', 'limited-edition']
}
```

### Hide Price and Show Tags
```javascript
// In config.js
DISPLAY: {
  SHOW_PRICE: false,
  SHOW_DESCRIPTION: true,
  SHOW_TAGS: true,
  MAX_DESCRIPTION_LENGTH: 100
}
```

## GraphQL Queries

The extension uses these GraphQL queries:

### Single Product
```graphql
{
  product(handle: "product-handle") {
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
    variants(first: 1) {
      edges {
        node {
          id
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
```

### Multiple Products
```graphql
{
  products(first: 10, sortKey: BEST_SELLING) {
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
        variants(first: 1) {
          edges {
            node {
              id
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
```

## Error Handling

The extension includes comprehensive error handling:

- **API Failures**: Graceful fallback to default product
- **Missing Products**: Logs errors and continues
- **Unavailable Products**: Filters out products not available for sale
- **Network Issues**: Timeout handling and retry logic

## Security Considerations

- Store API tokens in environment variables
- Use Storefront API (read-only) instead of Admin API
- Validate all user inputs
- Implement rate limiting if needed

## Troubleshooting

### Common Issues

1. **"No product to display"**
   - Check if products exist in your store
   - Verify products are available for sale
   - Check API token permissions

2. **"GraphQL fetch failed"**
   - Verify shop domain is correct
   - Check API token is valid
   - Ensure network connectivity

3. **Products not showing**
   - Check product selection strategy
   - Verify tags exist on products
   - Ensure products have variants

### Debug Mode

Enable console logging by checking the browser console during checkout to see detailed logs about the product fetching process.

## Next Steps

Consider implementing:

- **Personalization**: Show products based on customer's purchase history
- **A/B Testing**: Test different product selection strategies
- **Analytics**: Track which products are clicked
- **Dynamic Pricing**: Show special post-purchase pricing
- **Inventory Integration**: Only show products with sufficient stock 