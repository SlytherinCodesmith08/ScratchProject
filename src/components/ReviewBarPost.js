import React, { Component } from 'react';

export default class ReviewBarPost extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <form>
        <input type="text" placeholder="Type review here..." onChange={this.props.onReviewPostChange}></input>
        <input type="button" onClick={this.props.handleReviewSubmit} value="Submit Review"></input>
      </form>
    )
  }
}
