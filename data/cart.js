// cart.js

export let cart;

// Try to load the cart from localStorage
try {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
} catch (error) {
  console.error("Failed to parse cart data:", error);
  cart = [];
}

// If the cart is empty, initialize with default values
if (cart.length === 0) {
  cart = [
    {
      productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 2,
      deliveryOptionId: '1'
    },
    {
      productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
      quantity: 1,
      deliveryOptionId: '2'
    },
    {
      productId: "83d4ca15-0f35-48f5-b7a3-1ea210004f2e",
      quantity: 3,
      deliveryOptionId: '3'
    },
  ];
}

// Save the cart to localStorage
function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Add an item to the cart
export function addToCart(productId) {

  const addedButton = document.querySelector(`.js-added-to-cart-${productId}`);
  if (addedButton) {
    addedButton.classList.add("added");
  } else {
    console.error(`Element .js-added-to-cart-${productId} not found.`);
  }

  const quantitySelector = document.querySelector(
    `.js-quantity-selector-${productId}`
  );

  if (!quantitySelector) {
    console.error(`Quantity selector .js-quantity-selector-${productId} not found.`);
    return; // Early exit if selector is not found
  }

  const quantity = Number(quantitySelector.value);
  let matchingItem;
  cart.forEach((item) => {
    if (item.productId === productId) {
      matchingItem = item;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId: productId,
      quantity: quantity,
      deliveryOptionId: '1'
    });
  }

  saveToStorage();
}

// Remove an item from the cart
export function removeFromCart(productId) {
  cart = cart.filter((item) => item.productId !== productId);
  saveToStorage();
}

// Update the quantity of a specific item in the cart
export function updateQuantity(productId, quantity) {
  cart = cart.map((item) => {
    if (item.productId === productId) {
      item.quantity = quantity;
    }
    console.log(item);
    return item; // Return item to ensure array is updated
    
  });
  saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId){
  let matchingItem;
  cart.forEach((item) => {
    if (item.productId === productId) {
      matchingItem = item;
    }
  });

  matchingItem.deliveryOptionId = deliveryOptionId;

  saveToStorage();
}