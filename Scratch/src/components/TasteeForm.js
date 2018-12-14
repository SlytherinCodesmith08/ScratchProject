import React, { Component } from 'react';

export default class TasteeForm extends Component {
  constructor(props) {
    super(props);
    this.state = { description: '', slider: 1, capacity: 0 };
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
  }

  handleDescriptionChange(e) {
    this.setState({ description: e.target.value });
  }

  handleOnSubmit(e) {
    e.preventDefault();
  }

  render() {
    if (this.props.toggle === 1) {
      return (
        <form onSubmit={this.handleOnSubmit}>
          <div className="form">
            <div className="form-div">
              <h3>What would you like to taste?</h3>
              <textarea
                className="meal-description"
                name="description"
                value={this.state.name}
                onChange={this.handleDescriptionChange}
                required
              />
            </div>
          </div>
        </form>
      );
    } else return <div />;
  }
}
