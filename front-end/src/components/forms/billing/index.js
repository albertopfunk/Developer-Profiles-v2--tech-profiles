import React, { Component } from "react";
import styled from "styled-components";
import { ReactComponent as ConstructionPageIcon } from "../../../global/assets/page-construction-3.svg";
import { ReactComponent as ErrorPageIcon } from "../../../global/assets/page-error.svg";

import { httpClient } from "../../../global/helpers/http-requests";
import { USER_TYPE } from "../../../global/helpers/variables";
import Spacer from "../../../global/helpers/spacer";

import UserForm from "./UserForm";
import SubscriberForm from "./SubscriberForm";
import CustomerForm from "./CustomerForm";

class CheckoutContainer extends Component {
  state = {
    userType: "",
    userInfo: {},
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

    this.getSubInfo();
  };

  getSubInfo = async () => {
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

    this.setState({ userInfo: res.data });
    this.setUserType(USER_TYPE.subscriber);
  };

  setUserType = (type) => {
    this.setState({ userType: type });
  };

  render() {
    if (!this.state.userType) {
      return (
        <CheckoutFallback>
          <h1>Setting up Billing Information</h1>
          <Spacer size="20" axis="vertical" />
          <ConstructionPageIcon className="page-icon" />
        </CheckoutFallback>
      );
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
          stripeSubId={this.props.stripeSubId}
          status={this.state.userInfo.status}
          nickName={this.state.userInfo.nickName}
          type={this.state.userInfo.type}
          created={this.state.userInfo.created}
          startDate={this.state.userInfo.startDate}
          dueDate={this.state.userInfo.dueDate}
          editProfile={this.props.editProfile}
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
          <h2 id="billing-info">Your Subscription is Invactive</h2>
          <Spacer size="20" axis="vertical" />
          <ErrorPageIcon className="page-icon" />
        </CheckoutFallback>
      );
    }

    return (
      <CheckoutFallback>
        <h2 id="billing-info">Billing Error</h2>
        <Spacer size="20" axis="vertical" />
        <ErrorPageIcon className="page-icon" />
      </CheckoutFallback>
    );
  }
}

const CheckoutFallback = styled.div`
  text-align: center;
  width: 100%;
  max-width: 750px;
`;

export default CheckoutContainer;
