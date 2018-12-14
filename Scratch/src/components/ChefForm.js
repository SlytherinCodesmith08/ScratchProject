import React, { Component } from 'react';

const LIMIT = 10;
export default class ChefForm extends Component {
  constructor(props) {
    super(props);
    this.state = { description: '', time: '', capacity: 0 };
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleCapacityChange = this.handleCapacityChange.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
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

  handleOnSubmit(e) {
    e.preventDefault();
    const info = {
      host: 'Loser Girl',
      description: this.state.description,
      time: this.state.time,
      capacity: this.state.capacity,
      pos: { lat: 40.72127, lng: -74.000723 }
    };
    this.props.addMarker(info);
  }

  render() {
    if (this.props.toggle === 0) {
      return (
        <form onSubmit={this.handleOnSubmit}>
          <div className="form">
            <div className="form-div">
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
          </div>
        </form>
      );
    } else return <div />;
  }
}
