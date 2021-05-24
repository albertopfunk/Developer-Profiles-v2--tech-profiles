import React, { Component } from "react";
import styled from "styled-components";
import { httpClient } from "../../../global/helpers/http-requests";

class CustomerForm extends Component {
  state = {
    subType: "",
  };

  yearRef = React.createRef();
  monthRef = React.createRef();

  toggleYearCheckbox = () => {
    if (!this.monthRef.current || !this.yearRef.current) {
      return;
    }

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
    if (!this.monthRef.current || !this.yearRef.current) {
      return;
    }

    if (!(this.monthRef.current.checked || this.yearRef.current.checked)) {
      this.setState({ subType: "" });
      return;
    }

    if (this.yearRef.current.checked) {
      this.yearRef.current.checked = false;
    }
    this.setState({ subType: "monthly" });
  };

  onReSubscribe = async (e) => {
    e.preventDefault();
    
    if (this.state.subType !== "yearly" && this.state.subType !== "monthly") {
      return;
    }

    const [res, err] = await httpClient("POST", "/api/subscribe-existing", {
      stripeId: this.props.stripeId,
      subType: this.state.subType,
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
          <h2 id="billing-info">Renew your package</h2>

          <p>
            Live profile for anyone to see <br />
            Be found quickly with advanced filtering <br />
            Simple and live profile customization <br />
            Choose any city in the world for relocation
          </p>

          <FormSection aria-labelledby="form-section">
            <h3 id="form-section">Choose Sub Type</h3>

            <form onSubmit={(e) => this.onReSubscribe(e)}>
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
              <button
                type="submit"
                disabled={this.state.subType ? false : true}
              >
                Re-Subscribe
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

export default CustomerForm;
