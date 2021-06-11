import React, { useContext } from "react";

import CheckoutContainer from "../../../components/forms/billing";
import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";

function DashboardBilling() {
  const { user, editProfile } = useContext(ProfileContext);

  return (
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
  );
}

export default DashboardBilling;
