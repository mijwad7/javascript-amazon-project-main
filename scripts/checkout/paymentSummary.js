import { cart } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let deliveryTotal = 0;
  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    console.log(productId);
    const product = products.find((product) => product.id === productId);
    productPriceCents += product.priceCents * cartItem.quantity;

    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = deliveryOptions.find(
      (option) => option.id === deliveryOptionId
    );
    deliveryTotal += deliveryOption.priceCents;
  });

  const totalBeforeTax = productPriceCents + deliveryTotal;
  const taxCents = totalBeforeTax * 0.1;
  const totalCents = totalBeforeTax + taxCents;

  const total = (totalCents / 100).toFixed(2);

  const paymentSummaryHTML = `
    <div class="payment-summary-title">
        Order Summary
    </div>

    <div class="payment-summary-row">
        <div>Items (3):</div>
        <div class="payment-summary-money">$${(productPriceCents / 100).toFixed(2)}</div>
    </div>

    <div class="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div class="payment-summary-money">$${(deliveryTotal / 100).toFixed(2)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div class="payment-summary-money">$${(totalBeforeTax / 100).toFixed(2)}</div>
    </div>

    <div class="payment-summary-row">
        <div>Estimated tax (10%):</div>
        <div class="payment-summary-money">$${(taxCents / 100).toFixed(2)}</div>
    </div>

    <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money">$${total}</div>
    </div>

    <button class="place-order-button button-primary">
        Place your order
    </button>
  `;

  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;
}
