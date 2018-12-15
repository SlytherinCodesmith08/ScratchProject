import React, { Component } from 'react';

import SubscribersList from './SubscribersList';
const LIMIT = 10;
export default class ChefForm extends Component {
  constructor(props) {
    super(props);
    this.state = { description: '', time: '', title: '', capacity: 0 };
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleCapacityChange = this.handleCapacityChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
  }

  handleTitleChange(e) {
    this.setState({ title: e.target.value });
  }

  handleDescriptionChange(e) {
    this.setState({ description: e.target.value });
  }

  handleTimeChange(e) {
    this.setState({ time: e.target.value });
  }

  handleCapacityChange(e) {
    const capacity = Math.min(e.target.value, LIMIT);
    this.setState({ capacity: capacity });
  }

  handleTitleChange(e) {
    this.setState({ title: e.target.value });
  }

  handleOnSubmit(e) {
    e.preventDefault();
    const info = {
      title: this.state.title,
      description: this.state.description,
      time: this.state.time,
      capacity: this.state.capacity
    };
    this.props.addMarker(info);
  }

  render() {
    if (this.props.toggle === 'chef' && this.props.loggedIn === true) {
      return (
        <form onSubmit={this.handleOnSubmit}>
          <div className="form">
            <div className="form-div">
              <h3>Title</h3>
              <input
                type="text"
                name="title"
                value={this.state.title}
                onChange={this.handleTitleChange}
                required
              />
              <h3>What are you cooking?</h3>
              <textarea
                className="meal-description"
                name="description"
                value={this.state.name}
                onChange={this.handleDescriptionChange}
                required
              />
            </div>
            <div className="form-div">
              <div>
                <h3>When will your meal be ready?</h3>
                <input
                  type="time"
                  onChange={this.handleTimeChange}
                  id="appt"
                  name="appt"
                  required
                />
              </div>
              <div>
                <h3>How many people can you host?</h3>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  max={LIMIT}
                  value={this.state.capacity}
                  onChange={this.handleCapacityChange}
                />
              </div>
              <input type="submit" value="Submit" />
              <br />
            </div>
            <SubscribersList
              loggedIn={this.props.loggedIn}
              toggle={this.props.toggle}
            />
          </div>
        </form>
      );
    } else return <div />;
  }
}
