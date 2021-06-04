import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import styled from "styled-components";

import { SUBSCRIPTION_STATUS } from "../../../global/helpers/variables";

function StripeCardInput({
  email,
  subUser,
  subType,
  stripeAwait,
  stripeReady,
  subIdle,
  subLoading,
  subError,
  setSubscriptionStatus,
}) {
  const stripe = useStripe();
  const elements = useElements();

  async function createToken(e) {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      setSubscriptionStatus(SUBSCRIPTION_STATUS.stripeAwait);
      setTimeout(() => {
        setSubscriptionStatus(SUBSCRIPTION_STATUS.stripeReady);
      }, 1500);
      return;
    }

    setSubscriptionStatus(SUBSCRIPTION_STATUS.loading);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
      billing_details: {
        name: email,
      },
    });

    if (error || !paymentMethod) {
      console.error(error);
      setSubscriptionStatus(SUBSCRIPTION_STATUS.error);
      return;
    }
    subUser(paymentMethod.id);
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

      <button type="submit" onClick={createToken} disabled={!subType}>
        {subIdle ? "Purchase" : null}
        {stripeAwait ? "Stripe was not ready!" : null}
        {stripeReady ? "Stripe is ready! retry" : null}
        {subError ? "Error submitting payment, retry" : null}
        {subLoading ? "loading..." : null}
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
