import React, { Component } from "react";
import axios from "axios";
import styled from "styled-components";

class SubscriberForm extends Component {
  state = {
    status: "",
    nickName: "",
    type: "",
    created: "",
    startDate: "",
    dueDate: ""
  };

  componentDidMount() {
    this.getSubInfo();
  }

  getSubInfo = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER}/api/get-subscription`,
        {
          sub: this.props.stripeSubId
        }
      );

      if (res.data.status === "inactiveSubscriber") {
        this.props.setUserType("inactiveSubscriber");
        return;
      }

      for (let data in res.data) {
        if (data === "created" || data === "startDate" || data === "dueDate") {
          let date = res.data[data] * 1000;
          let normDate = new Date(date);
          normDate = normDate.toString();
          let normDateArr = normDate.split(" ");
          res.data[
            data
          ] = `${normDateArr[1]} ${normDateArr[2]} ${normDateArr[3]}`;
        }
      }

      this.setState(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  cancelSub = async () => {
    const res = await axios.post(
      `${process.env.REACT_APP_SERVER}/api/cancel-subscription`,
      {
        sub: this.props.stripeSubId
      }
    );

    console.log("CANCEL DATA", res.data);

    this.props.editUserProfile({
      stripe_subscription_name: null
    });
  };

  render() {
    return (
      <CheckoutContainer>
        <h3>Subscription Type</h3>
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

        <button onClick={this.cancelSub}>Cancel Subscription</button>
      </CheckoutContainer>
    );
  }
}

const CheckoutContainer = styled.section`
  width: 100%;
  height: 100%;
  background-color: skyblue;
`;

export default SubscriberForm;
