import {
  extend,
  BlockStack,
  Button,
  CalloutBanner,
  Heading,
  Image,
  Text,
  TextContainer,
  Separator,
  Tiles,
  TextBlock,
  Layout,
} from "@shopify/post-purchase-ui-extensions";

const APP_URL = "https://carol-using-enormous-loose.trycloudflare.com";


// ShouldRender - fetch offer from backend
extend("Checkout::PostPurchase::ShouldRender", async ({ inputData, storage }) => {
  try {
    const response = await fetch(`${APP_URL}/api/offer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        referenceId: inputData.initialPurchase.referenceId,
        token: inputData.token,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const postPurchaseOffer = await response.json();

    if (postPurchaseOffer?.offers?.length > 0) {
      await storage.update(postPurchaseOffer);
      return { render: true };
    } else {
      await storage.update({ offers: [] });
      return { render: false };
    }
  } catch (error) {
    console.error("Error fetching offer:", error);
    await storage.update({ offers: [] });
    return { render: false };
  }
});

// Render Extension

extend(
  "Checkout::PostPurchase::Render",
  (root, { done, storage, calculateChangeset, applyChangeset, inputData }) => {
    // Debug: log the storage object
    console.log('storage:', storage);
    // Defensive: check for valid offer data
    if (!storage.initialData || !storage.initialData.offers || !storage.initialData.offers.length) {
      console.log('No offers found in storage.initialData:', storage.initialData);
      root.appendChild(
        root.createComponent("CalloutBanner", { title: "No offer available" }, [
          root.createComponent("Text", {}, "Sorry, we couldn't load your offer. Please try again later.")
        ])
      );
      return;
    }

    const offer = storage.initialData.offers[0];
    console.log('Selected offer:', offer);

    // Handler to accept the offer and add to order
    
    async function acceptOffer() {
      try {
        console.log("🔧 Starting changeset calculation...");

        // 1. Calculate the changeset
        const changesetResult = await calculateChangeset({ changes: offer.changes });
        console.log("✅ Changeset calculated:", changesetResult);

        // 2. Prepare the sign-changeset request
        const signChangesetUrl = `${APP_URL}/api/sign-changeset`;
        const requestBody = {
          referenceId: inputData.initialPurchase.referenceId,
          changes: offer.id, // or offer.changes, depending on backend expectation
        };

        console.log("📡 Sending request to:", signChangesetUrl);
        const response = await fetch(signChangesetUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${inputData.token}`,
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`🚫 Backend responded with status ${response.status}`);
        }

        const { token } = await response.json();
        console.log("🔐 Received token from backend:", token);

        // 3. Apply the changeset using the token
        await applyChangeset(token);
        console.log("✅ Changeset applied successfully.");

        // 4. Finish process
        done();
      } catch (err) {
        console.error("❌ Failed to accept offer:", err);
        // Show error banner in the UI
        root.appendChild(
          root.createComponent(CalloutBanner, { title: "Error" }, [
            root.createComponent(Text, {}, "Sorry, we couldn't process your request. Please try again later.")
          ])
        );
      }
  }


    // Render the offer UI
    root.appendChild(
      root.createComponent(BlockStack, { spacing: "loose" }, [
        root.createComponent(Heading, {}, "Special Offer"),
        root.createComponent(Text, {}, `Add ${offer.productTitle} to your order for ${offer.discountedPrice}?`),
        root.createComponent(Button, { onPress: acceptOffer }, "Accept Offer"),
        root.createComponent(Button, { onPress: acceptOffer }, "Add to Order"),
        root.createComponent(Button, { onPress: done, subdued: true }, "Decline"),
      ])
    );
  }
);
