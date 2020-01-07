import React, { Component } from "react";
import axios from "axios";
import styled from "styled-components";
import UserForm from "../../../components/forms/profile-dashboard/billing/UserForm";
import SubscriberForm from "../../../components/forms/profile-dashboard/billing/SubscriberForm";
import CustomerForm from "../../../components/forms/profile-dashboard/billing/CustomerForm";

class CheckoutContainer extends Component {
  state = {
    userType: ""
  };

  componentDidMount() {
    if (!this.props.stripeId) {
      this.setState({ userType: "user" });
    } else if (this.props.stripeId && !this.props.stripeSubId) {
      this.setState({ userType: "customer" });
    } else {
      this.checkSubStatus();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.stripeSubId !== this.props.stripeSubId) {
      if (this.props.stripeSubId) {
        this.checkSubStatus();
      } else {
        this.setState({ userType: "customer" });
      }
    }
  }

  checkSubStatus = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER}/api/get-subscription`,
        {
          sub: this.props.stripeSubId
        }
      );

      if (res.data.status === "active") {
        this.setState({ userType: "subscriber" });
      } else {
        this.setState({ userType: "inactiveSubscriber" });
      }
    } catch (err) {
      console.error(err);
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
