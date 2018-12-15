import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import { GoogleLogout } from 'react-google-login';
export default class SigninButton extends Component {
  constructor(props) {
    super(props);
  }

  responseGoogle(response) {
    this.props.toggleSignIn(response);
  }

  logout() {
    console.log('logout');
    this.props.toggleSignIn();
  }

  render() {
    if (this.props.loggedIn === false) {
      return (
        <GoogleLogin
          clientId="179151549004-bq1f71sg2fhgfesr1bf7g6f83dk256jo.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={this.responseGoogle.bind(this)}
          onFailure={this.responseGoogle.bind(this)}
        />
      );
    } else
      return (
        <GoogleLogout
          buttonText="Logout"
          onLogoutSuccess={this.logout.bind(this)}
        />
      );
  }
}
