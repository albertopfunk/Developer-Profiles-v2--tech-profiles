import React, { useContext } from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";

import CheckoutContainer from "../../../components/forms/billing";
import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";

function DashboardBilling() {
  const { user, editProfile } = useContext(ProfileContext);

  return (
    <Main id="main-content" tabIndex="-1" aria-labelledby="main-heading">
      <Helmet>
        <title>Dashboard Billing • Tech Profiles</title>
      </Helmet>
      <h1 id="main-heading">Billing</h1>
      <CheckoutContainer
        stripeId={user.stripe_customer_id}
        stripeSubId={user.stripe_subscription_name}
        email={user.email}
        id={user.id}
        editProfile={editProfile}
      />
    </Main>
  );
}

const Main = styled.main`
  width: 100%;
  height: 100vh;
  padding-top: 100px;
  background-color: pink;
`;

export default DashboardBilling;
