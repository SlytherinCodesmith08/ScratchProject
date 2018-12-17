import React, { Component } from 'react';

export default class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = { slider: 1 };

    this.handleSliderChange = this.handleSliderChange.bind(this);
  }
  handleSliderChange(e) {
    this.props.updateRadius(e.target.value);
    this.setState({ slider: e.target.value });
  }
  render() {
    return (
      <div align="left">
        <div className="slidecontainer">
          <h1 className='slider-header'>Search Distance {this.state.slider * this.props.UNITS} km</h1>
          <input
            type="range"
            min="1"
            max="100"
            value={this.state.slider}
            className="slider"
            id="myRange"
            onChange={this.handleSliderChange}
          />
        </div>
      </div>
    );
  }
}
