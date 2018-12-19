import React, { Component } from 'react';
import ChefForm from './ChefForm';
import SigninButton from './SigninButton';
import TasteeForm from './TasteeForm';
import Slider from './Slider';
import ReviewBarPost from './ReviewBarPost';
import ReviewBarView from './ReviewBarView';
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
      userList: [],
      seeReviews: false,
      postReviews: false,
      reviews: [],
      review: ''
    };
    this.markers = {};
    this.closeWindow = this.closeWindow.bind(this)
    this.onReviewPostChange = this.onReviewChange.bind(this)
    this.handleReviewSubmit = this.handleReviewSubmit.bind(this)
  }

  componentDidMount() {
    this.initMap();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.map !== prevState.map) {
      //this.getUsers();
      this.getPostings();
    }

    if (this.state.userList !== prevState.userList) {
      this.populateMap();
      this.initCircle();
    }

    if (this.state.radius !== prevState.radius) {
      this.populateMap();
    }

    if (this.state.toggle !== prevState.toggle) {
      this.populateMap();
    }
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
        function (position) {
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
        function () {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
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

  addMarker(info) {
    if (this.markers[info.id] === undefined) {

      const map = this.state.map;
      const location = {
        lat: Number(info.lat),
        lng: Number(info.lon)
      };
      const marker = new google.maps.Marker({
        position: location,
        map: map
      });

      const description = InfoWindowContent(
        info,
        this.state.toggle,
        this.subscribe.bind(this),
        this.handleSeeReviews.bind(this),
        this.handlePostReviews.bind(this),

      );

      const infoWindow = new google.maps.InfoWindow({
        content: description,
        maxWidth: 200
      });
      infoWindow.setPosition(location);

      marker.addListener('click', function () {
        infoWindow.open(map, marker);
      });

      console.log('sending data', info);
      this.markers[info.id] = marker;
    }
  }

  addPostingMarker(info) {
    info.firstname = this.state.user.firstname;
    info.lastname = this.state.user.lastname;
    info.email = this.state.user.email;
    info.lat = this.state.currentLocation.lat;
    info.lon = this.state.currentLocation.lng;
    const map = this.state.map;
    const marker = new google.maps.Marker({
      position: this.state.currentLocation,
      map: map
    });

    const description = InfoWindowContent(
      info,
      this.state.toggle,
      this.subscribe.bind(this),
      this.handleSeeReviews.bind(this),
      this.handlePostReviews.bind(this)
    );
    const infoWindow = new google.maps.InfoWindow({
      content: description,
      maxWidth: 200
    });
    infoWindow.setPosition(this.state.currentLocation);

    marker.addListener('click', function () {
      infoWindow.open(map, marker);
    });

    this.sendData(info);
  }

  toggle() {
    const toggle = this.state.toggle === 'chef' ? 'tastee' : 'chef';
    for (let key of Object.keys(this.markers)) {
      this.markers[key].setMap(null);
      delete this.markers[key];
    }
    this.setState({ toggle });
  }

  getUsers() {
    console.log('getting users');
    const self = this;
    fetch('http://localhost:3000/users', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(function (response) {

        return response.json();
      })
      .then(function (myJson) {
        console.log(myJson);
        self.setState({ userList: myJson });
      });
  }

  getPostings() {
    console.log('getting users');
    const self = this;
    fetch('http://localhost:3000/postings', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        console.log(myJson);
        self.setState({ userList: myJson });
      });
  }
  handleSeeReviews(e) {

    fetch(`http://localhost:3000/reviews/${document.querySelector("#chefName").innerHTML}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      return res.json();
    }).then(reviews => {

      this.setState({
        reviews: reviews,
        seeReviews: true
      })
    })
      .catch(err => {
        console.log('Err in handleSeeReviews: ', err)
      })
  }

  handlePostReviews() {
    this.setState({
      postReviews: true
    })
  }
  onReviewChange(e) {
    e.preventDefault()
    this.setState({
      review: e.target.value
    })
  }
  handleReviewSubmit(e) {
    console.log(this.state.user.imageUrl)
    e.preventDefault()
    fetch('http://localhost:3000/reviews', {
      method: 'POST',
      type: 'cors',
      body: JSON.stringify({
        reviewer_name: this.state.user.lastname,
        date_created: new Date(),
        imageurl: this.state.user.imageUrl,
        review: this.state.review,
        chef_name: document.querySelector('#chefName').innerHTML
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        console.log(res.json())
        this.setState({
          review: ''
        })
      })
      .then(() => this.closeWindow())
  }
  //CODE SECTION FOR FETCH REQUESTS MADE TO THE SERVER
  subscribe() {
    //Fetch Code Goes Here
  }

  sendData(info) {

    console.log('Sending', info);
    fetch('http://localhost:3000/postings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(info)
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        console.log(JSON.stringify(myJson));
      });
  }

  distance(locationA, locationB) {
    /** Converts numeric degrees to radians */
    const toRadians = x => {
      return (x * Math.PI) / 180;
    };
    var R = 6371e3; // metres
    var φ1 = toRadians(Number(locationA.lat));//toRadians(locationA.lat);
    var φ2 = toRadians(Number(locationB.lat));
    var Δφ = toRadians(Number(locationB.lat - locationA.lat));
    var Δλ = toRadians(Number(locationB.lon - locationA.lng));

    var a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = R * c;
    return d;
  }

  populateMap() {

    for (let event of this.state.userList) {
      const location = { lat: event.lat, lon: event.lon };
      if (
        this.distance(this.state.currentLocation, location) <=
        this.state.radius
      ) {
        this.addMarker(event)
      }
      else {
        if (this.markers[event.id] !== undefined) {
          this.markers[event.id].setMap(null);
          delete this.markers[event.id];
        }
      }
    }
  }

  updateRadius(slider) {
    const circle = this.state.circle;
    circle.setRadius(slider * UNITS);
    this.setState({ radius: slider * UNITS });
  }
  closeWindow(e) {

    this.setState({
      seeReviews: false,
      postReviews: false
    })
  }
  toggleSignIn(response) {
    const loggedIn = this.state.loggedIn === true ? false : true;
    const map = this.state.map;
    let user = null;
    if (loggedIn === true) {
      const profileObj = response.profileObj;
      const userObj = {
        email: profileObj.email,
        firstname: profileObj.familyName,
        lastname: profileObj.givenName,
        location: map.getCenter(),
        imageUrl: profileObj.imageUrl
      };
      user = userObj;
    }

    this.setState({ loggedIn, user });
  }

  render() {
    return (
      <div>
        <div id="navbar">
          <div id="left">
            <img className="logo" src="/img/logo.jpg" alt="logo" />
          </div>
          <div id="right">
            <button
              className="btn btn-primary toggle"
              onClick={this.toggle.bind(this)}
            >
              {this.state.toggle}
              {' mode'}
            </button>
            <SigninButton
              loggedIn={this.state.loggedIn}
              toggleSignIn={this.toggleSignIn.bind(this)}
            />
          </div>
        </div>
        <div id="content">
          <div id="content-left">
            <div id="map" />
            <section className="settings">
              <Slider
                UNITS={UNITS}
                updateRadius={this.updateRadius.bind(this)}
              />
              {this.state.seeReviews &&
                <ReviewBarView closeWindow={this.closeWindow} reviews={this.state.reviews} />}
              {this.state.postReviews &&
                <ReviewBarPost closeWindow={this.closeWindow} handleReviewSubmit={this.handleReviewSubmit} onReviewPostChange={this.onReviewPostChange} />}
            </section>
          </div>
          <div id="content-right">
            <ChefForm
              user={this.state.user}
              loggedIn={this.state.loggedIn}
              toggle={this.state.toggle}
              addPostingMarker={this.addPostingMarker.bind(this)}
            />
            <TasteeForm
              loggedIn={this.state.loggedIn}
              map={this.map}
              toggle={this.state.toggle}
            />
          </div>
        </div>
      </div>
    );
  }
}
