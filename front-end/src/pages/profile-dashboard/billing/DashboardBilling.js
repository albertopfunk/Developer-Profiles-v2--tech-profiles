import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Elements, StripeProvider } from "react-stripe-elements";
import CheckoutForm from "../../../components/forms/profile-dashboard/billing/CheckoutForm";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";

function DashboardBilling() {
  const { loadingUser, user, editProfile } = useContext(ProfileContext);
  const [stripe, setStripe] = useState(null);

  useEffect(() => {
    if (window.Stripe) {
      setStripe(window.Stripe(process.env.REACT_APP_STRIPE));
    } else {
      document.querySelector("#stripe-js").addEventListener("load", () => {
        setStripe(window.Stripe(process.env.REACT_APP_STRIPE));
      });
    }
  }, []);

  console.log("Billing", user);
  if (loadingUser || stripe === null) {
    return <h1>Loading...</h1>;
  }
  return (
    <StripeProvider stripe={stripe}>
      <Main>
        <h1>React Stripe Elements Example</h1>
        <Elements>
          <CheckoutForm
            stripeId={user.stripe_customer_id}
            stripeSubId={user.stripe_subscription_name}
            email={user.email}
            id={user.id}
            editProfile={editProfile}
          />
        </Elements>
      </Main>
    </StripeProvider>
  );
}

const Main = styled.main`
  width: 100%;
  height: 100vh;
  padding-top: 100px;
  background-color: pink;
`;

export default DashboardBilling;
