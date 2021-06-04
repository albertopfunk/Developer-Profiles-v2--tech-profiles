import React, { Component } from "react";
import styled from "styled-components";

import { httpClient } from "../../../global/helpers/http-requests";
import {
  SUBSCRIPTION_STATUS,
  USER_TYPE,
} from "../../../global/helpers/variables";

class SubscriberForm extends Component {
  state = {
    subStatus: SUBSCRIPTION_STATUS.idle,
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
      this.props.setUserType(USER_TYPE.checkoutError);
      return;
    }

    if (res.data.status !== "active") {
      this.props.setUserType(USER_TYPE.inactiveSubscriber);
      return;
    }

    this.setState(res.data);
  };

  cancelSub = async (e) => {
    e.preventDefault();

    this.setState({ subStatus: SUBSCRIPTION_STATUS.loading });

    const [res, err] = await httpClient("POST", "/api/cancel-subscription", {
      sub: this.props.stripeSubId,
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      this.setState({ subStatus: SUBSCRIPTION_STATUS.error });
      return;
    }

    const results = await this.props.editProfile({
      stripe_subscription_name: null,
    });

    if (results?.error) {
      this.setState({ subStatus: SUBSCRIPTION_STATUS.error });
    }
  };

  render() {
    const subIdle = this.state.subStatus === SUBSCRIPTION_STATUS.idle;
    const subLoading = this.state.subStatus === SUBSCRIPTION_STATUS.loading;
    const subError = this.state.subStatus === SUBSCRIPTION_STATUS.error;

    return (
      <CheckoutContainer>
        <div className="info-container">
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
              {subIdle ? "Cancel Subscription" : null}
              {subLoading ? "loading..." : null}
              {subError ? "Error canceling subscription, retry" : null}
            </button>
          </form>
        </FormSection>
      </CheckoutContainer>
    );
  }
}

const CheckoutContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;

  .info-container {
    width: 100%;
    text-align: center;
  }
`;

const FormSection = styled.section`
  width: 100%;
`;

export default SubscriberForm;
