import React, { Component } from 'react';

export default class ReviewBarView extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let reviews = this.props.reviews.map((review) => {
      return (<div>
        <h3>{review.chef_name} Reviews</h3>
        <p>{review.review}</p>
        <h4>- {review.reviewer_name}</h4>
        <div id="review-img">
          <img src={review.imageUrl} />
        </div>
        <h5>{review.date_created}</h5>
      </div>)
    })

    return (
      <div>
        <div>{reviews}</div>
        <button onClick={this.props.closeWindow}>Close Window</button>
      </div>
    )
  }
}
