import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import styled from "styled-components";

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
    <ControlsContainer>
      <div>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "14px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                  fontSize: "14px",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>

      <button
        type="submit"
        onClick={createToken}
        disabled={!stripe || !props.subType}
      >
        Purchase
      </button>
    </ControlsContainer>
  );
}

const ControlsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;

  button {
    width: 80%;
    margin: 0 auto;
  }
`;

export default StripeCardInput;
