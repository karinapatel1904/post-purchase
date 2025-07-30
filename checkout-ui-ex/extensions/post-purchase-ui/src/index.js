import {
  extend,
  BlockStack,
  InlineStack,
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

const APP_URL = "https://proxy-train-vegetable-apnic.trycloudflare.com";


// ShouldRender - fetch offer from backend
extend("Checkout::PostPurchase::ShouldRender", async ({ inputData, storage }) => {
  try {
    const response = await fetch(`${APP_URL}/api/offer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        referenceId: inputData.initialPurchase.referenceId,
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

    // const offer = storage.initialData.offers[0];
    const offers = storage.initialData.offers || [];

    console.log('Selected offers:', offers);

    // Handler to accept the offer and add to order
    
    async function acceptOffer(offer) {
      console.log('Selected offer:', offer);

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

  const mainContainer = root.createComponent(BlockStack, {
    spacing: "loose",
    maxInlineSize: "1/1", // closest to 100% width
    padding: "base",      // "base" = Shopify’s built-in spacing unit
    alignment: "center"
  });

  // Add heading for all offers
  mainContainer.appendChild(
      root.createComponent(Heading, {}, "Special Offers")
    );

    const cardGroup = root.createComponent(InlineStack, {
      spacing: 'base',
      wrap: true,            // 💡 allow cards to wrap to new row
      alignment: 'start',    // 💡 align cards to the top
    });

    for (let i = 0; i < offers.length; i++) {
      const offer = offers[i];

      const cardContainer = root.createComponent(BlockStack, {
        spacing: 'loose',
        padding: '20px',
        borderWidth: 'medium',         // Already present
        borderColor: 'base',           // Add this line for border color
        borderStyle: 'solid',          // Optional, if supported by the framework
        cornerRadius: 'large',         // Updated from 'medium' for more visible rounding
        background: 'surface',
        maxInlineSize: '50%',
      });

      // IMAGE
      const productImage = root.createComponent(Image, {
        source: offer.productImageURL || 'https://via.placeholder.com/400x300',
        description: offer.productTitle,
        borderRadius: 'base',
      });

      // TITLE
      const title = root.createComponent(Heading, { level: 2 }, offer.productTitle);

      // DESCRIPTION
      const description = root.createComponent(Text, {}, `Add this to your order for ${offer.discountedPrice}?`);

      // BUTTONS
      const buttonGroup = root.createComponent(InlineStack, { spacing: 'base' });

      const addButton = root.createComponent(
        Button,
        {
          onPress: () => acceptOffer(offer),
          kind: 'primary',
        },
        'Add to Order'
      );

      const declineButton = root.createComponent(
        Button,
        {
          onPress: done,
          kind: 'secondary',
        },
        'Decline'
      );

      buttonGroup.appendChild(addButton);
      buttonGroup.appendChild(declineButton);

      // Assemble Card
      cardContainer.appendChild(productImage);
      cardContainer.appendChild(title);
      cardContainer.appendChild(description);
      cardContainer.appendChild(buttonGroup);

      
      cardGroup.appendChild(cardContainer);
      
    }


      mainContainer.appendChild(
        root.createComponent(BlockStack, { spacing: 'loose' }, [cardGroup])
      );

    root.appendChild(mainContainer);
  }
);
