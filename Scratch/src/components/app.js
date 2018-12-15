import React, { Component } from 'react';
import ChefForm from './ChefForm';
import SigninButton from './SigninButton';
import TasteeForm from './TasteeForm';
import Slider from './Slider';

import { InfoWindowContent } from './InfoWindowContent';
import { events } from './TestEvents';
const initialOffset = 0.00068;
const UNITS = 200;
export default class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
      toggle: 'chef',
      map: null,
      circle: null,
      user: null,
      currentLocation: null,
      radius: 200,
      userList: []
    };
  }

  componentDidMount() {
    this.initMap();
    this.getUsers();
    this.populateMap();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.map !== prevState.map) {
      this.populateMap();
      this.initCircle();
    }
  }

  getUsers() {
    fetch('/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        this.setState({ userList: myJson });
      });
  }

  sendData(info) {
    const post = Object.assign({}, this.state.user);
    post.description = info.description;
    post.capacity = info.capacity;
    post.title = info.title;
    post.location = this.state.currentLocation;
    console.log(post);
    fetch('/postings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        console.log(JSON.stringify(myJson));
      });
  }

  addMarker(info) {
    const map = this.state.map;
    const marker = new google.maps.Marker({
      position: info.currentLocation,
      map: map
    });
    const description = InfoWindowContent(
      info.givenName + ' ' + info.familyName,
      info
    );
    const infoWindow = new google.maps.InfoWindow({
      content: description,
      maxWidth: 200
    });
    infoWindow.setPosition(info.currentLocation);

    marker.addListener('click', function() {
      infoWindow.open(map, marker);
    });

    this.sendData(info);
  }

  populateMap() {
    for (let user of this.state.userList) {
      this.addMarker(user);
    }
  }

  initCircle() {
    const map = this.state.map;
    const cityCircle = new google.maps.Circle({
      strokeColor: '#000099',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#6699ff',
      fillOpacity: 0.35,
      map: map,
      center: map.getCenter(),
      radius: 1 * UNITS
    });
    this.setState({ circle: cityCircle });
  }

  updateRadius(slider) {
    const circle = this.state.circle;
    circle.setRadius(slider * UNITS);
    this.setState({ radius: slider * UNITS });
  }

  initMap() {
    // The location of Uluru
    var uluru = { lat: -25.344, lng: 131.036 };
    // The map, centered at Uluru
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: uluru
    });
    const infoWindow = new google.maps.InfoWindow();

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      var self = this;
      navigator.geolocation.getCurrentPosition(
        function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          infoWindow.setPosition({
            lat: pos.lat + initialOffset,
            lng: pos.lng
          });
          infoWindow.setContent('You Are Here');
          infoWindow.setZIndex(-1000);
          infoWindow.open(map);
          map.setCenter(pos);
          map.setZoom(16);
          // The marker, positioned at Uluru
          // var marker = new google.maps.Marker({ position: pos, map: map });
          // marker.addListener('click', function() {
          //   infoWindow.open(map, marker);
          // });
          // map.panTo(marker.position);
          self.setState({ map: map, currentLocation: pos });
        },
        function() {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  }

  toggle() {
    const toggle = this.state.toggle === 'chef' ? 'tastee' : 'chef';
    this.setState({ toggle });
  }

  toggleSignIn(response) {
    const loggedIn = this.state.loggedIn === true ? false : true;
    const map = this.state.map;
    let user = null;
    if (loggedIn === true) {
      // console.log(response);
      const profileObj = response.profileObj;
      const userObj = {
        email: profileObj.email,
        familyName: profileObj.familyName,
        givenName: profileObj.givenName,
        imageUrl: profileObj.imageUrl,
        location: map.getCenter(),
        radius: this.state.radius
      };
      user = userObj;
    }

    this.setState({ loggedIn, user });
  }

  render() {
    // console.log(this.state);
    return (
      <div>
        <section>
          <h1 className="logo">Tastee</h1>
        </section>
        <section>
          <div id="map" />
        </section>
        <Slider UNITS={UNITS} updateRadius={this.updateRadius.bind(this)} />
        <button onClick={this.toggle.bind(this)}>Toggle </button>
        <SigninButton
          loggedIn={this.state.loggedIn}
          toggleSignIn={this.toggleSignIn.bind(this)}
        />
        <ChefForm
          loggedIn={this.state.loggedIn}
          toggle={this.state.toggle}
          addMarker={this.addMarker.bind(this)}
        />
        <TasteeForm
          loggedIn={this.state.loggedIn}
          map={this.map}
          toggle={this.state.toggle}
        />
      </div>
    );
  }
}
