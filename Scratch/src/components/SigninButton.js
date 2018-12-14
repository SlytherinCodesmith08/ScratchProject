import React, { Component } from 'react';

export default class SigninButton extends Component {
  constructor(props) {
    super(props);
    this.signOut = this.signOut.bind(this);
  }

  signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }


  render() {
    return (
      <div>
        <div className="g-signin2" data-onsuccess="onSignIn"></div>
        <a href="#" onClick={this.signOut}>Sign out</a>
      </div>
    );
  }

};
