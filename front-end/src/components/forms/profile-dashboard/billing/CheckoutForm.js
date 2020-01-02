import React, { Component } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";
import axios from "axios";
import styled from "styled-components";

// check if user is subscribed

// other todos
// show details of subscription
// cancel sub
// renew sub
// ediit sub

// STATES

// User - has never subscribed
// checkout container
// stripeID AND subID === NULL

// Subscribed Customer - has subscription
// info container
// next payment date
// amount due
// edit credit card*
// edit sub type
// cancel sub
// stripeID AND subID === TRUE

// Customer - previous subscription
// re-sub options container
// renew sub
// stripeID === TRUE, subID === NULL

// CONSTRAINTS

// user can only become a customer if user subscribes
// once a user subscribes, user will always be a customer
// user db stripe customer ID should never be deleted(unless user completely deletes account)
// existing customer ID will be used to re-sub

// FEATURES

// user can cancel a sub, renew a sub, update type of sub, update cc,

class CheckoutForm extends Component {
  state = {
    existingCust: false,
    existingSub: false,
    subType: "",
    complete: false
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

  subscribeUser = async () => {
    if (this.state.subType !== "yearly" && this.state.subType !== "monthly") {
      return;
    }

    let { token } = await this.props.stripe.createToken({
      name: this.props.email
    });

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER}/api/subscribe`,
        {
          token: token.id,
          subType: this.state.subType,
          email: this.props.email
        }
      );
      this.props.editProfile(res.data);

      // might not need this, editProfile re-renders,
      // so you can check existing cust/sub on re-render
      //this.setState({ complete: true });
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    console.log(
      "===CHECKOUT===",
      this.state.subType,
      this.props.stripeId,
      this.props.stripeSubId
    );
    if (this.state.complete) return <h1>Purchase Complete</h1>;

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

          <form
            onSubmit={e => {
              e.preventDefault();
              this.subscribeUser();
            }}
          >
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

            <CardElement style={elementStyles} />
            <button disabled={this.state.subType ? false : true}>
              Purchase
            </button>
          </form>
        </Article>
      </CheckoutContainer>
    );
  }
}

const CheckoutContainer = styled.section`
  width: 100%;
  background-color: skyblue;
`;

const Article = styled.article`
  height: 800px;
  width: 600px;
  border: solid;
  background-color: white;
`;

const elementStyles = {
  base: {
    fontSize: "20px",
    color: "#000",
    letterSpacing: "0.025em",
    fontFamily: "Source Code Pro, monospace",
    "::placeholder": {
      color: "#000099"
    }
  },
  invalid: {
    color: "#9e2146"
  }
};

export default injectStripe(CheckoutForm);
