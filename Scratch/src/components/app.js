import React, { Component } from 'react';
import ChefForm from './ChefForm';
<<<<<<< HEAD
import TasteeForm from './TasteeForm';
import Slider from './Slider';
=======
import SigninButton from './SigninButton';
>>>>>>> OAuth
import { InfoWindowContent } from './InfoWindowContent';
import { events } from './TestEvents';
const initialOffset = 0.00068;
const UNITS = 200;
export default class App extends Component {
  constructor() {
    super();
    this.state = { toggle: 0, map: null, circle: null };
  }
  componentDidMount() {
    this.initMap();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.map !== prevState.map) {
      this.populateMap();
      this.initCircle();
    }
  }

  addMarker(event) {
    const map = this.state.map;
    const marker = new google.maps.Marker({
      position: event.pos,
      map: map
    });
    const description = InfoWindowContent(event);
    const infoWindow = new google.maps.InfoWindow({
      content: description,
      maxWidth: 200
    });
    infoWindow.setPosition(event.pos);

    marker.addListener('click', function() {
      infoWindow.open(map, marker);
    });
  }

  populateMap() {
    for (let chef of events) {
      this.addMarker(chef);
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
          var marker = new google.maps.Marker({ position: pos, map: map });
          marker.addListener('click', function() {
            infoWindow.open(map, marker);
          });
          map.panTo(marker.position);

          self.setState({ map: map });
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
    const toggle = this.state.toggle === 0 ? 1 : 0;
    this.setState({ toggle });
  }

  render() {
    return (
      <div>
        <section>
          <h1 className="logo">Tastee</h1>
        </section>
        <section>
          <div id="map" />
        </section>
<<<<<<< HEAD
        <Slider UNITS={UNITS} updateRadius={this.updateRadius.bind(this)} />
=======
        <SigninButton/>
>>>>>>> OAuth
        <button onClick={this.toggle.bind(this)}>Toggle </button>
        <ChefForm
          toggle={this.state.toggle}
          addMarker={this.addMarker.bind(this)}
        />
        <TasteeForm map={this.map} toggle={this.state.toggle} />
      </div>
    );
  }
}
