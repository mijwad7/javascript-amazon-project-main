export let cart = JSON.parse(localStorage.getItem("cart"));

if (!cart) {
    cart = [{
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 2
    }, {
        productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 1
    }, {
      productId: "83d4ca15-0f35-48f5-b7a3-1ea210004f2e",
      quantity: 3
    }];
}

function saveToStorage(){
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(productId) {
  let matchingItem;

  const addedButton = document.querySelector(`.js-added-to-cart-${productId}`);
  addedButton.classList.add("added");

  const quantitySelector = document.querySelector(
    `.js-quantity-selector-${productId}`
  );

  const quantity = Number(quantitySelector.value);

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
    });
  }
  saveToStorage();
}

export function removeFromCart(productId){
  cart = cart.filter((item) => item.productId !== productId);
  saveToStorage();
}