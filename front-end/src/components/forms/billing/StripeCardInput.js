import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

function StripeCardInput(props) {
  const stripe = useStripe();
  const elements = useElements();

  async function createToken(e) {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      name: props.email,
      card: elements.getElement(CardElement),
    });

    if (error || !paymentMethod) {
      console.error(error);
      return;
    }
    props.subUser(paymentMethod.id);
  }

  return (
    <>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      />

      <button
        type="submit"
        onClick={createToken}
        disabled={!stripe || !props.subType}
      >
        Purchase
      </button>
    </>
  );
}

export default StripeCardInput;
