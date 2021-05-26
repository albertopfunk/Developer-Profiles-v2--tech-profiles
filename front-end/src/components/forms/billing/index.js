import React, { Component } from "react";
import styled from "styled-components";
import { httpClient } from "../../../global/helpers/http-requests";

import UserForm from "./UserForm";
import SubscriberForm from "./SubscriberForm";
import CustomerForm from "./CustomerForm";
import { USER_TYPE } from "../../../global/helpers/variables";

class CheckoutContainer extends Component {
  state = {
    userType: "",
  };

  componentDidMount() {
    if (!this.props.stripeId) {
      this.setUserType(USER_TYPE.user);
    } else if (this.props.stripeId && !this.props.stripeSubId) {
      this.setUserType(USER_TYPE.customer);
    } else {
      this.checkSubStatus();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.stripeSubId !== this.props.stripeSubId) {
      if (this.props.stripeSubId) {
        this.checkSubStatus();
      } else {
        this.setUserType(USER_TYPE.customer);
      }
    }
  }

  checkSubStatus = async () => {
    const [res, err] = await httpClient("POST", "/api/get-subscription", {
      sub: this.props.stripeSubId,
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      this.setUserType(USER_TYPE.checkoutError);
      return;
    }

    if (res.data.status !== "active") {
      this.setUserType(USER_TYPE.inactiveSubscriber);
      return;
    }

    this.setUserType(USER_TYPE.subscriber);
  };

  setUserType = (type) => {
    this.setState({ userType: type });
  };

  render() {
    if (!this.state.userType) {
      return <h1>Skeleton Loader...</h1>;
    }

    if (this.state.userType === USER_TYPE.user) {
      return (
        <UserForm
          isMainContent={this.props.isMainContent}
          editProfile={this.props.editProfile}
          email={this.props.email}
        />
      );
    }

    if (this.state.userType === USER_TYPE.subscriber) {
      return (
        <SubscriberForm
          isMainContent={this.props.isMainContent}
          editProfile={this.props.editProfile}
          stripeSubId={this.props.stripeSubId}
          setUserType={this.setUserType}
        />
      );
    }

    if (this.state.userType === USER_TYPE.customer) {
      return (
        <CustomerForm
          isMainContent={this.props.isMainContent}
          editProfile={this.props.editProfile}
          stripeId={this.props.stripeId}
          setUserType={this.setUserType}
        />
      );
    }

    if (this.state.userType === USER_TYPE.inactiveSubscriber) {
      return (
        <CheckoutFallback>
          <h2 id="billing-info">INACTIVE</h2>
        </CheckoutFallback>
      );
    }

    return (
      <CheckoutFallback>
        <h2 id="billing-info">UNKNOWN ERROR</h2>
      </CheckoutFallback>
    );
  }
}

const CheckoutFallback = styled.div`
  width: 100%;
`;

export default CheckoutContainer;
