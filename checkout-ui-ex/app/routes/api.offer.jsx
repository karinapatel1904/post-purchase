import { json } from "@remix-run/node";

import { authenticate } from "../shopify.server";
import { getOffers } from "../offer.server";

// The loader responds to preflight requests from Shopify
export const loader = async ({ request }) => {
  // Handle preflight OPTIONS request for CORS
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*", // For dev, use *; restrict in prod
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }
  // Always return CORS headers for any other loader call
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
};

// The action responds to the POST request from the extension. Make sure to use the cors helper for the request to work.
export const action = async ({ request }) => {
  // Manual CORS headers for reliability
  const offers = getOffers();
  return new Response(JSON.stringify({ offers }), {
    headers: {
      "Access-Control-Allow-Origin": "https://cdn.shopify.com", // or "*" for dev
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Content-Type": "application/json",
    },
  });
};