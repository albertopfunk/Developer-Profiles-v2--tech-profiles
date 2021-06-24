import React, { Component } from "react";
import styled from "styled-components";

import { httpClient } from "../../../global/helpers/http-requests";
import {
  SUBSCRIPTION_STATUS,
  USER_TYPE,
} from "../../../global/helpers/variables";
import Spacer from "../../../global/helpers/spacer";

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
          <h2 id="billing-info">Subscription Info</h2>
          <Spacer axis="vertical" size="15" />
          <dl className="info-group" aria-label="current information">
            <div className="flex-row">
              <div className="flex-col">
                <div>
                  <dt>Name</dt>
                  <dd>{this.state.nickName}</dd>
                </div>
                <div>
                  <dt>Type</dt>
                  <dd>{this.state.type}</dd>
                </div>
                <div>
                  <dt>Date Created</dt>
                  <dd>{this.state.created}</dd>
                </div>
              </div>

              <div className="flex-col">
                <div>
                  <dt>Due Date</dt>
                  <dd>{this.state.dueDate}</dd>
                </div>
                <div>
                  <dt>Start Date</dt>
                  <dd>{this.state.startDate}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{this.state.status}</dd>
                </div>
              </div>
            </div>
          </dl>
          <Spacer axis="vertical" size="20" />
          <form onSubmit={(e) => this.cancelSub(e)}>
            <button
              type="submit"
              id="cancel-subscribe-btn"
              className="button button-control"
              data-main-content={this.props.isMainContent ? "true" : "false"}
            >
              <span className="button-text">
                {subIdle ? "Cancel Subscription" : null}
                {subLoading ? "loading..." : null}
                {subError ? "Error canceling subscription, retry" : null}
              </span>
            </button>
          </form>
      </CheckoutContainer>
    );
  }
}

const CheckoutContainer = styled.div`
  button {
    width: 90%;
    max-width: 350px;
  }
`;

export default SubscriberForm;
