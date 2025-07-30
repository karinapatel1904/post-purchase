// sign-changeset.jsx

import { json } from "@remix-run/node";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

import { authenticate } from "../shopify.server";
import { getSelectedOffer } from "../offer.server";

// Preflight handler
export const loader = async ({ request }) => {
  // Set CORS headers for preflight
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
};

// POST request handler
export const action = async ({ request }) => {
  // Set CORS headers for POST
  const body = await request.json();

  const selectedOffer = getSelectedOffer(body.changes);

  const payload = {
    iss: process.env.SHOPIFY_API_KEY,
    jti: uuidv4(),
    iat: Date.now(),
    sub: body.referenceId,
    changes: selectedOffer?.changes,
  };

  const token = jwt.sign(payload, process.env.SHOPIFY_API_SECRET);

  return new Response(JSON.stringify({ token }), {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Content-Type": "application/json",
    },
  });
};
