import React, { Component } from "react";
import styled from "styled-components";
import { httpClient } from "../../../global/helpers/http-requests";

class SubscriberForm extends Component {
  state = {
    status: "",
    nickName: "",
    type: "",
    created: "",
    startDate: "",
    dueDate: "",
  };

  componentDidMount() {
    this.getSubInfo();
  }

  getSubInfo = async () => {
    const [res, err] = await httpClient("POST", "/api/get-subscription", {
      sub: this.props.stripeSubId,
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

  cancelSub = async (e) => {
    e.preventDefault();

    const [res, err] = await httpClient("POST", "/api/cancel-subscription", {
      sub: this.props.stripeSubId,
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return;
    }

    this.props.editUserProfile({
      stripe_subscription_name: null,
    });
  };

  render() {
    return (
      <CheckoutContainer>
        <div>
          <h2 id="billing-info">Your current subscription information</h2>

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
        </div>

        <FormSection aria-labelledby="form-section">
          <h3 id="form-section">Cancel subscription</h3>

          <form onSubmit={(e) => this.cancelSub(e)}>
            <button
              type="submit"
              id="cancel-subscribe-btn"
              data-main-content={this.props.isMainContent ? "true" : "false"}
            >
              Cancel Subscription
            </button>
          </form>
        </FormSection>
      </CheckoutContainer>
    );
  }
}

const CheckoutContainer = styled.div`
  width: 100%;
`;

const FormSection = styled.section`
  width: 100%;
`;

export default SubscriberForm;
