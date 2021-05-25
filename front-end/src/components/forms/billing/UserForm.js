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
        <div className="info-container">
          <h2 id="billing-info">Choose your first package</h2>

          <p>
            Live profile for anyone to see <br />
            Be found quickly with advanced filtering <br />
            Simple and live profile customization <br />
            Choose any city in the world for relocation
          </p>
        </div>

        <FormSection aria-labelledby="form-section">
          <h3 id="form-section">Choose Subscription</h3>

          <form className="subscriptions-form">

            <div className="subscriptions-container">
              <div className="subscription">
                <div className="input">
                  <input
                    ref={this.yearRef}
                    type="checkbox"
                    name="subscription-type"
                    id="yearly"
                    aria-describedby="year-info year-price"
                    data-main-content={
                      this.props.isMainContent ? "true" : "false"
                    }
                    onChange={this.toggleYearCheckbox}
                  />
                </div>

                <div className="label">
                  <label htmlFor="yearly">Yearly</label>
                </div>

                <div className="info">
                  <p id="year-info">Pay less for a full year, cancel anytime</p>
                </div>

                <div className="price">
                  <p id="year-price">$9.99</p>
                  <span>save 15%</span>
                </div>
              </div>

              <div className="subscription">
                <div className="input">
                  <input
                    ref={this.monthRef}
                    type="checkbox"
                    name="subscription-type"
                    id="monthly"
                    aria-describedby="month-info month-price"
                    onChange={this.toggleMonthCheckbox}
                  />
                </div>

                <div className="label">
                  <label htmlFor="monthly">Monthly</label>
                </div>

                <div className="info">
                  <p id="month-info">Pay monthly, cancel anytime</p>
                </div>

                <div className="price">
                  <p id="month-price">.99c</p>
                </div>
              </div>
            </div>

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

  .subscriptions-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }

  .subscriptions-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  .subscription {
    width: 100%;
    padding: 5px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 6px 0 hsla(0, 0%, 0%, 0.2);

    display: grid;
    grid-template-columns: .2fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    column-gap: 5px;
    row-gap: 10px;

    .input {
      grid-column: 1 / 2;
      grid-row: 1 / 2;
      justify-self: center;
      align-self: center;
    }

    .label {
      grid-column: 2 / 3;
      grid-row: 1 / 2;
      justify-self: start;
      align-self: center;
    }

    .info {
      grid-column: 1 / 4;
      grid-row: 2 / 3;
      justify-self: stretch;
      align-self: center;
      text-align: center;
    }

    .price {
      grid-column: 3 / 4;
      grid-row: 1 / 2;
      
      justify-self: end;
      align-self: center;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
  }
`;

export default UserForm;
