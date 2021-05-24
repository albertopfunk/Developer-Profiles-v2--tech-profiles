import React, { Component } from "react";

import StripeCardInput from "./StripeCardInput";

import styled from "styled-components";
import { httpClient } from "../../../global/helpers/http-requests";

class UserForm extends Component {
  state = {
    subType: "",
  };

  yearRef = React.createRef();
  monthRef = React.createRef();

  toggleYearCheckbox = () => {
    if (!(this.monthRef.current.checked || this.yearRef.current.checked)) {
      this.setState({ subType: "" });
      return;
    }

    if (this.monthRef.current.checked) {
      this.monthRef.current.checked = false;
    }
    this.setState({ subType: "yearly" });
  };

  toggleMonthCheckbox = () => {
    if (!(this.monthRef.current.checked || this.yearRef.current.checked)) {
      this.setState({ subType: "" });
      return;
    }

    if (this.yearRef.current.checked) {
      this.yearRef.current.checked = false;
    }
    this.setState({ subType: "monthly" });
  };

  onSubscribe = async (tokenId) => {
    if (this.state.subType !== "yearly" && this.state.subType !== "monthly") {
      return;
    }

    const [res, err] = await httpClient("POST", "/api/subscribe", {
      token: tokenId,
      subType: this.state.subType,
      email: this.props.email,
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return;
    }

    this.props.editUserProfile(res.data);
  };

  render() {
    return (
      <CheckoutContainer>
          <h2 id="billing-info">Choose your first package</h2>

          <p>
            Live profile for anyone to see <br />
            Be found quickly with advanced filtering <br />
            Simple and live profile customization <br />
            Choose any city in the world for relocation
          </p>

          <FormSection aria-labelledby="form-section">
            <h3 id="form-section">Choose Sub Type</h3>

            <form>
              <label htmlFor="yearly">
                <input
                  ref={this.yearRef}
                  type="checkbox"
                  name="subscription-type"
                  id="yearly"
                  data-main-content={this.props.isMainContent ? "true" : "false"}
                  onChange={this.toggleYearCheckbox}
                />
                Yearly
              </label>

              <br />

              <label htmlFor="monthly">
                <input
                  ref={this.monthRef}
                  type="checkbox"
                  name="subscription-type"
                  id="monthly"
                  onChange={this.toggleMonthCheckbox}
                />
                Monthly
              </label>

              <StripeCardInput
                subUser={this.onSubscribe}
                subType={this.state.subType}
              />
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

export default UserForm;
