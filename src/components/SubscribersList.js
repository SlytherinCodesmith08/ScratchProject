import React, { Component } from 'react';

const names = ['Bob', 'Evan', 'James'];
export default class SubscribersList extends Component {
  constructor(props) {
    super(props);
  }

  renderList() {
    return names.map(name => {
      return <li>{name}</li>;
    });
  }

  render() {
    // if (this.props.toggle === 'chef' && this.props.loggedIn === true) {
    //   return (
    //     <div>
    //       <h2>Subscribers List</h2>
    //       <ul>{this.renderList()}</ul>
    //     </div>
    //   );
    // } else
    return <div />;
  }
}
