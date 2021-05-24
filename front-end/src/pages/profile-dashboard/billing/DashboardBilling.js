import React, { useContext } from "react";
import { Helmet } from "react-helmet";

import CheckoutContainer from "../../../components/forms/billing";
import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";

function DashboardBilling() {
  const { user, editProfile } = useContext(ProfileContext);
  console.log(user, user.stripe_customer_id, user.stripe_subscription_name)
  return (
    <>
      <Helmet>
        <title>Dashboard Billing • Tech Profiles</title>
      </Helmet>
      <h1 id="main-heading">Billing</h1>

      <section aria-labelledby="billing-info">
        <CheckoutContainer
          isMainContent={true}
          stripeId={user.stripe_customer_id}
          stripeSubId={user.stripe_subscription_name}
          email={user.email}
          id={user.id}
          editProfile={editProfile}
        />
      </section>
    </>
  );
}

export default DashboardBilling;
