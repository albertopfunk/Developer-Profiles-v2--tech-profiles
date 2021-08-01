import React, { Component } from "react";
import styled from "styled-components";

import ControlButton from "../buttons/ControlButton";

import { httpClient } from "../../../global/helpers/http-requests";
import {
  SUBSCRIPTION_STATUS,
} from "../../../global/helpers/variables";
import Spacer from "../../../global/helpers/spacer";

class SubscriberForm extends Component {
  state = {
    subStatus: SUBSCRIPTION_STATUS.idle
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
                <dd>{this.props.nickName}</dd>
              </div>
              <div>
                <dt>Type</dt>
                <dd>{this.props.type}</dd>
              </div>
              <div>
                <dt>Date Created</dt>
                <dd>{this.props.created}</dd>
              </div>
            </div>

            <div className="flex-col">
              <div>
                <dt>Due Date</dt>
                <dd>{this.props.dueDate}</dd>
              </div>
              <div>
                <dt>Start Date</dt>
                <dd>{this.props.startDate}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{this.props.status}</dd>
              </div>
            </div>
          </div>
        </dl>
        <Spacer axis="vertical" size="20" />
        <form onSubmit={(e) => this.cancelSub(e)}>
          <ControlButton
            type="submit"
            buttonText={`
              ${subIdle ? "Cancel Subscription" : ""}${
              subLoading ? "loading..." : ""
            }${subError ? "Error canceling subscription, retry" : ""}`}
            attributes={{
              id: "cancel-subscribe-btn",
            }}
          />
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
