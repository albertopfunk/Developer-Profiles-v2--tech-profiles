import React, { Component } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";

class StripeCardInput extends Component {
  createToken = async () => {
    let { token } = await this.props.stripe.createToken({
      name: this.props.email
    });
    this.props.subUser(token.id);
  };

  render() {
    return (
      <>
        <CardElement style={elementStyles} />
        <button
          onClick={this.createToken}
          disabled={this.props.subType ? false : true}
        >
          Purchase
        </button>
      </>
    );
  }
}

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

export default injectStripe(StripeCardInput);
