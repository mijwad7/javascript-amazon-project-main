import { cart, removeFromCart, updateQuantity, updateDeliveryOption } from "../../data/cart.js";
import { products } from "../../data/products.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary(){

  let checkoutHTML = "";

  const today = dayjs();

  const deliveryDate = today.add(2, "day").format("dddd, MMMM D");


  cart.forEach((item) => {
    const productId = item.productId;
    const product = products.find((product) => product.id === productId);
    const deliveryOptionId = item.deliveryOptionId;
    const deliveryOption = deliveryOptions.find(option => option.id === deliveryOptionId);

    // Check if the delivery option was found
    if (!deliveryOption) {
      console.error(`Delivery option with ID ${deliveryOptionId} not found for product ${productId}.`);
      return; // Skip this item if delivery option is not found
    }
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    checkoutHTML += `
          <div class="cart-item-container js-cart-item-container-${productId}">
              <div class="delivery-date">
                Delivery date: ${dateString}
              </div>

              <div class="cart-item-details-grid">
                <img class="product-image"
                  src="${product.image}">

                <div class="cart-item-details">
                  <div class="product-name">
                    ${product.name}
                  </div>
                  <div class="product-price">
                    ${(product.priceCents / 100).toFixed(2)}
                  </div>
                  <div class="product-quantity">
                    <span>
                      Quantity: <span class="js-quantity-label-${productId}">${
      item.quantity
    }</span>
                    </span>
                    <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id=${productId}>
                      Update
                    </span>
                    <input type="number" min="1" class="quantity-input js-quantity-input-${productId}" value="${
      item.quantity
    }">
                    <span class="save-quantity-link link-primary" data-product-id=${productId}>Save</span>
                    <span class="delete-quantity-link link-primary js-delete-link" data-product-id=${productId}>
                      Delete
                    </span>
                  </div>
                </div>

                <div class="delivery-options">
                  <div class="delivery-options-title">
                    Choose a delivery option:
                  </div>
                  ${deliveryOptionsHTML(productId, item)}
                </div>
              </div>
            </div>
      `;
  });

  function deliveryOptionsHTML(productId, item) {
    let html = "";
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
      const dateString = deliveryDate.format("dddd, MMMM D");
      const priceString =
        deliveryOption.priceCents === 0
          ? "FREE Shipping"
          : `$${(deliveryOption.priceCents / 100).toFixed(2)} - Shipping`;
      const isChecked = deliveryOption.id === item.deliveryOptionId;
      html += `
        <div class="delivery-option js-delivery-option" data-product-id=${productId} data-delivery-option-id="${deliveryOption.id}">
          <input type="radio"
            ${isChecked ? "checked" : ""}
            class="delivery-option-input"
            name="delivery-option-${productId}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString}
            </div>
          </div>
        </div>
      `;
    });

    return html;
  }

  const checkoutDiv = document.querySelector(".order-summary");
  if (checkoutDiv) {
    checkoutDiv.innerHTML = checkoutHTML;
  } else {
    console.error(".order-summary element not found.");
  }

  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      const productDiv = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      if (productDiv) {
        productDiv.remove();
      } else {
        console.error(`.js-cart-item-container-${productId} not found.`);
      }
      renderPaymentSummary();
    });
  });

  // Calculate the total quantity
  const totalQuantity = cart.reduce((accumulator, currentItem) => {
    return accumulator + currentItem.quantity;
  }, 0);

  // Display the total quantity
  const homeLink = document.querySelector(".return-to-home-link");
  if (homeLink) {
    homeLink.innerHTML = `Total Quantity: ${totalQuantity}`;
  } else {
    console.error(".return-to-home-link element not found.");
  }

  document.querySelectorAll(".js-update-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      console.log("Update product ID:", productId);
      const productDiv = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      if (productDiv) {
        productDiv.classList.add("is-editing-quantity");
      } else {
        console.error(`.js-cart-item-container-${productId} not found.`);
      }
    });
  });

  document.querySelectorAll(".save-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      console.log("Save product ID:", productId);
      const productDiv = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      if (productDiv) {
        productDiv.classList.remove("is-editing-quantity");
      } else {
        console.error(`.js-cart-item-container-${productId} not found.`);
      }

      const newQuantityHTML = productDiv.querySelector(
        `.js-quantity-input-${productId}`
      ).value;
      const newQuantity = Number(newQuantityHTML);
      const quantityLabel = productDiv.querySelector(
        `.js-quantity-label-${productId}`
      );
      quantityLabel.textContent = newQuantity;

      updateQuantity(productId, newQuantity);
      renderPaymentSummary();
    });
  });

  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const {productId, deliveryOptionId} = element.dataset;
      console.log(productId, deliveryOptionId)

      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    })
  })

}

