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
    if (!this.state.userType) {
      return <h1>Skeleton Loader...</h1>;
    }

    if (this.state.userType === "user") {
      return (
        <CheckoutSection>
          <UserForm
            isMainContent={this.props.isMainContent}
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
            isMainContent={this.props.isMainContent}
            editUserProfile={this.editUserProfile}
            stripeSubId={this.props.stripeSubId}
            setUserType={this.setUserType}
          />
        </CheckoutSection>
      );
    }

    if (this.state.userType === "customer") {
      return (
        <CheckoutSection>
          <CustomerForm
            isMainContent={this.props.isMainContent}
            editUserProfile={this.editUserProfile}
            stripeId={this.props.stripeId}
            setUserType={this.setUserType}
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

    return (
      <CheckoutSection>
        <h1>UNKNOWN</h1>
      </CheckoutSection>
    );
  }
}

const CheckoutSection = styled.section`
  width: 800px;
  height: 650px;
  background-color: skyblue;
`;

export default CheckoutContainer;
