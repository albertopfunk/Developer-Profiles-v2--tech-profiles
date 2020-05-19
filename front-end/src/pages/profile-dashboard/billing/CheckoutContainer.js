import React, { Component } from "react";
import styled from "styled-components";
import { userSubInfo } from "../../../components/http-requests/profile-dashboard";
import UserForm from "../../../components/billing/UserForm";
import SubscriberForm from "../../../components/billing/SubscriberForm";
import CustomerForm from "../../../components/billing/CustomerForm";

class CheckoutContainer extends Component {
  state = {
    userType: ""
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
    const [res, err] = await userSubInfo(this.props.stripeSubId);

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return;
    }

    if (res.status === "active") {
      this.setUserType("subscriber");
    } else {
      this.setUserType("inactiveSubscriber");
    }
  };

  setUserType = type => {
    this.setState({ userType: type });
  };

  editUserProfile = items => {
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
