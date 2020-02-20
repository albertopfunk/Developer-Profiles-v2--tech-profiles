import React, { Component } from "react";
import StripeCardInput from "./StripeCardInput";
import axios from "axios";
import styled from "styled-components";

class UserForm extends Component {
  state = {
    subType: ""
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

  subscribeUser = async tokenId => {
    if (this.state.subType !== "yearly" && this.state.subType !== "monthly") {
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER}/api/subscribe`,
        {
          token: tokenId,
          subType: this.state.subType,
          email: this.props.email
        }
      );
      const { stripe_customer_id, stripe_subscription_name } = res.data;

      this.props.editUserProfile({
        stripe_customer_id,
        stripe_subscription_name
      });
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    return (
      <CheckoutContainer>
        <Article>
          <h2>Choose your package</h2>

          <p>
            Live profile for anyone to see <br />
            Be found quickly with advanced filtering <br />
            Simple and live profile customization <br />
            Choose any city in the world for relocation
          </p>

          <form>
            <h3>Choose Sub Type</h3>

            <label htmlFor="yearly">
              <input
                ref={this.yearRef}
                type="checkbox"
                name="subscription-type"
                id="yearly"
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
          </form>
          <StripeCardInput
            subUser={this.subscribeUser}
            subType={this.state.subType}
          />
        </Article>
      </CheckoutContainer>
    );
  }
}

const CheckoutContainer = styled.section`
  width: 100%;
  height: 100%;
  background-color: skyblue;
`;

const Article = styled.article`
  width: 95%;
  height: 95%;
  border: solid;
  background-color: white;
`;

export default UserForm;