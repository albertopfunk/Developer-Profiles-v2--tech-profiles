import React, { Component } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";
import axios from "axios";
import styled from "styled-components";


// FEATURES

// user can become a customer by subscribing

// customer can cancel subscription
// customer can edit subscription type
// customer can edit credit card

// customer can renew subscription



// SOLUTION IDEAS

// first solution - no returns, no discounts for early cancel/edit
// prorate: false
// this is not how stripe works by default
// stripe calculates and returns, or applies discounts
// 'By default, we prorate subscription changes'
// https://stripe.com/docs/api/subscriptions/update
// If you don't want to prorate at all, set the prorate option to false and the customer would be billed $100 on May 1 and $200 on June 1. Similarly, if you set prorate to false when switching between different billing intervals (monthly to yearly, for example), we won't generate any credits for the old subscription's unused time—although we will still reset the billing date and will bill immediately for the new subscription.

// become a customer by subscribing
  // create customer
  // subscribe customer
  // charge immediately
// cancel subscription
  // unsubscribe customer
  // unsubscribe will take effect immediately
  // no returns for early unsubscribe
// edit subscription type
  // unsubscribe customer
  // unsubscribe will take effect immediately
  // no returns for early unsubscribe
  // subscribe customer to new chosen subscription
  // charge immediately
  // charge will be full price, no discounts for early sub edit
// edit credit card
  //
// renew subscription
  // subscribe customer
  // charge immediately
  // charge will be full price, no discounts for early sub cancel/renew
//


// second solution - returns, discounts, applied credit
// prorate: true(default)
// cancelling will take effect at end of period with option to reactivate beforehand
// everything will be the same, stripe handles all calculating
// for edit sub type, work with https://stripe.com/docs/api/subscriptions/update
// instead of removing sub and adding new sub

// become a customer by subscribing
  // create customer
  // subscribe customer
  // charge immediately
// cancel subscription
  // unsubscribe customer
  // unsubscribe will take effect immediately
  // stripe handles returns to cc
// edit subscription type
  // https://stripe.com/docs/api/subscriptions/update
  // stripe handles differences
  // whether user downgrades/upgrades
// edit credit card
  //
// renew subscription
  // subscribe customer
  // charge immediately
  // charge will be full price, since stripe already returned when user canceled
//

// if customer does not pay subscription or payment does not go thru
// need to check sub status, if you just leave the subID
// then the sub can expire, but you will not know



// STATES



// User - has never subscribed
// checkout container
// stripeID AND subID === NULL
  // new sub
//

// Subscribed Customer - has subscription
// info container
// next payment date
// amount due
// stripeID AND subID === TRUE
  // cancel sub
  // edit sub type
  // edit credit card
//

// Subscribed INACTIVE Customer
// needs attention container
// https://stripe.com/docs/billing/subscriptions/set-up-subscription#manage-sub-status
// https://github.com/stripe-samples/set-up-subscriptions/blob/master/client/script.js#L90-L117
// https://stripe.com/docs/api/subscriptions/object#subscription_object-status
// https://stripe.com/docs/api/subscriptions/object#subscription_object-latest_invoice
// https://stripe.com/docs/api/payment_intents/object#payment_intent_object-status
// 
// stripeID AND subID === TRUE
// sub status check !== "active"


// Customer - previous subscription
// renew sub options container
// stripeID === TRUE, subID === NULL
  // renew sub
//


// CONSTRAINTS

// user can only become a customer if user subscribes
// once a user subscribes, user will always be a customer
// user db stripe customer ID should never be deleted(unless user completely deletes account)
// existing customer ID will be used to renew sub


// FNs

// didMount
// check user status
// if user_sub=true, check sub status, needs to be "active"

// new sub
  // choose sub type
  // subscribe

// cancel sub

// renew sub

// edit sub type

// edit cc



// STEPS

// ComponentDidMount
  // isUser? this.propsstripeId && this.props.stripeSubId === NULL
    // userType: "user"
    // checkout container/Choose your package container

  // isCustomer? this.propsstripeId === TRUE && this.props.stripeSubId === NULL
    // userType: "customer"
    // renew sub options container

  // isSubscriber? this.propsstripeId && this.props.stripeSubId === TRUE
    // isActiveSubscriber? sub status check === "active"
      // userType: "subscriber"
      // info container
    // isInactiveSubscriber? sub status check !== "active"
      // userType: "inactiveSubscriber"
      // needs attention container
//



// checkout container/Choose your package container
// userType: "user"
// choose sub type - toggleYearCheckbox() || toggleMonthCheckbox()
// create customer + subscribe customer - subscribeUser()

// renew sub options container
// userType: "customer"
// choose sub type - toggleYearCheckbox() || toggleMonthCheckbox()
// subscribe existing customer - subscribeExistingUser()

// info container
// userType: "subscriber"
// sub type
// next payment date
// amount due
// cancelSubscription()
// editsubscriptionType() - stretch?
// editCreditCard() - stretch?

// needs attention container - stretch?
// userType: "inactiveSubscriber"


class CheckoutForm extends Component {
  state = {
    subType: "",
    userType: "",
    complete: false
  };

  yearRef = React.createRef();
  monthRef = React.createRef();

  componentDidMount() {
    if (this.props.stripeId === null && this.props.stripeSubId === null) {
      console.log("USER");
      this.setState({ userType: "user" });
    } else if (this.props.stripeId && this.props.stripeSubId === null) {
      console.log("CUST");
      this.setState({ userType: "customer" });
    } else if (this.props.stripeId && this.props.stripeSubId) {
      console.log("SUB");
      axios
        .post(`${process.env.REACT_APP_SERVER}/api/customer-sub`, {
          sub: this.props.stripeSubId
        })
        .then(res => {
          console.log(res.data);
          console.log(res.data.status);
          if (res.data.status === "active") {
            console.log("ACTIVE-SUB");
            this.setState({ userType: "subscriber" });
          } else if (res.data.status !== "active") {
            console.log("IN-ACTIVE-SUB");
            this.setState({ userType: "inactiveSubscriber" });
          }
        })
        .catch(err => console.error(err));
    }
  }

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

    // needs err handling
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
      this.props.stripeSubId,
      this.state.userType
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
