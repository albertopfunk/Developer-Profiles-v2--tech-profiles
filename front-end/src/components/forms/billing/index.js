import React, { Component } from "react";
import styled from "styled-components";
import { httpClient } from "../../../global/helpers/http-requests";

import UserForm from "./UserForm";
import SubscriberForm from "./SubscriberForm";
import CustomerForm from "./CustomerForm";

class CheckoutContainer extends Component {
  state = {
    userType: "",
  };

  componentDidMount() {
    if (!this.props.stripeId) {
      this.setUserType("user");
    } else if (this.props.stripeId && !this.props.stripeSubId) {
      this.setUserType("customer");
    } else {
      this.checkSubStatus();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.stripeSubId !== this.props.stripeSubId) {
      if (this.props.stripeSubId) {
        this.checkSubStatus();
      } else {
        this.setUserType("customer");
      }
    }
  }

  checkSubStatus = async () => {
    const [res, err] = await httpClient("POST", "/api/get-subscription", {
      sub: this.props.stripeSubId,
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return;
    }

    if (res.data.status !== "active") {
      this.setUserType("inactiveSubscriber");
      return;
    }

    this.setUserType("subscriber");
  };

  setUserType = (type) => {
    this.setState({ userType: type });
  };

  editUserProfile = (items) => {
    this.props.editProfile(items);
  };

  render() {
    console.log(
      "===CHECKOUT===",
      this.props.stripeId,
      this.props.stripeSubId,
      this.state.userType
    );

    if (!this.state.userType) {
      return <h1>Loading...</h1>;
    }

    if (this.state.userType === "user") {
      return (
        <CheckoutSection>
          <UserForm
            editUserProfile={this.editUserProfile}
            email={this.props.email}
          />
        </CheckoutSection>
      );
    }

    if (this.state.userType === "subscriber") {
      return (
        <CheckoutSection>
          <SubscriberForm
            stripeSubId={this.props.stripeSubId}
            editUserProfile={this.editUserProfile}
            setUserType={this.setUserType}
          />
        </CheckoutSection>
      );
    }

    if (this.state.userType === "customer") {
      return (
        <CheckoutSection>
          <CustomerForm
            editUserProfile={this.editUserProfile}
            setUserType={this.setUserType}
            stripeId={this.props.stripeId}
          />
        </CheckoutSection>
      );
    }

    if (this.state.userType === "inactiveSubscriber") {
      return (
        <CheckoutSection>
          <h1>INACTIVE</h1>
        </CheckoutSection>
      );
    }
  }
}

const CheckoutSection = styled.section`
  width: 800px;
  height: 650px;
  background-color: skyblue;
`;

export default CheckoutContainer;
