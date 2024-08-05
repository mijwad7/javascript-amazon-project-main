class Cart {
  cartItems;
  localStorageKey;

  constructor(localStorageKey){
    this.localStorageKey = localStorageKey;
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      this.cartItems = JSON.parse(localStorage.getItem(this.localStorageKey)) || [];
    } catch (error) {
      console.error("Failed to parse cart data:", error);
      this.cartItems = [];
    }

    // If the cart is empty, initialize with default values
    if (this.cartItems.length === 0) {
      this.cartItems = [
        {
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 2,
          deliveryOptionId: "1",
        },
        {
          productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
          quantity: 1,
          deliveryOptionId: "2",
        },
        {
          productId: "83d4ca15-0f35-48f5-b7a3-1ea210004f2e",
          quantity: 3,
          deliveryOptionId: "3",
        },
      ];
    }
  }
  saveToStorage() {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.cartItems));
  }
  addToCart(productId) {
    const addedButton = document.querySelector(
      `.js-added-to-cart-${productId}`
    );
    if (addedButton) {
      addedButton.classList.add("added");
    } else {
      console.error(`Element .js-added-to-cart-${productId} not found.`);
    }

    const quantitySelector = document.querySelector(
      `.js-quantity-selector-${productId}`
    );

    if (!quantitySelector) {
      console.error(
        `Quantity selector .js-quantity-selector-${productId} not found.`
      );
      return; // Early exit if selector is not found
    }

    const quantity = Number(quantitySelector.value);
    let matchingItem;
    this.cartItems.forEach((item) => {
      if (item.productId === productId) {
        matchingItem = item;
      }
    });

    if (matchingItem) {
      matchingItem.quantity += quantity;
    } else {
      this.cartItems.push({
        productId: productId,
        quantity: quantity,
        deliveryOptionId: "1",
      });
    }

    this.saveToStorage();
  }
  removeFromCart(productId) {
    this.cartItems = this.cartItems.filter(
      (item) => item.productId !== productId
    );
    this.saveToStorage();
  }
  updateQuantity(productId, quantity) {
    this.cartItems = this.cartItems.map((item) => {
      if (item.productId === productId) {
        item.quantity = quantity;
      }
      console.log(item);
      return item; // Return item to ensure array is updated
    });
    this.saveToStorage();
  }
  updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;
    this.cartItems.forEach((item) => {
      if (item.productId === productId) {
        matchingItem = item;
      }
    });

    matchingItem.deliveryOptionId = deliveryOptionId;

    this.saveToStorage();
  }
}

const cart = new Cart("cart");
const businessCart = new Cart('businessCart');


console.log(cart);
console.log(businessCart);
