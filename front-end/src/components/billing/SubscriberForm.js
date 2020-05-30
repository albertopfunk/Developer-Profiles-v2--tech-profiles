import React, { Component } from "react";
import styled from "styled-components";
import { httpClient } from "../http-requests";

class SubscriberForm extends Component {
  state = {
    status: "",
    nickName: "",
    type: "",
    created: "",
    startDate: "",
    dueDate: ""
  };

  componentDidMount() {
    this.getSubInfo();
  }

  getSubInfo = async () => {
    const [res, err] = await httpClient("POST", "/api/get-subscription", {
      sub: this.props.stripeSubId
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return;
    }

    if (res.data.status !== "active") {
      this.props.setUserType("inactiveSubscriber");
      return;
    }

    this.setState(res.data);
  };

  cancelSub = async () => {
    const [res, err] = await httpClient("POST", "/api/cancel-subscription", {
      sub: this.props.stripeSubId
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return;
    }

    this.props.editUserProfile({
      stripe_subscription_name: null
    });
  };

  render() {
    return (
      <CheckoutContainer>
        <h3>Subscription Type</h3>
        <p>{this.state.type}</p>

        <h3>Name</h3>
        <p>{this.state.nickName}</p>

        <h3>Date Created</h3>
        <p>{this.state.created}</p>

        <h3>Due Date</h3>
        <p>{this.state.dueDate}</p>

        <h3>Start Date</h3>
        <p>{this.state.startDate}</p>

        <h3>Status</h3>
        <p>{this.state.status}</p>

        <button onClick={this.cancelSub}>Cancel Subscription</button>
      </CheckoutContainer>
    );
  }
}

const CheckoutContainer = styled.section`
  width: 100%;
  height: 100%;
  background-color: skyblue;
`;

export default SubscriberForm;
