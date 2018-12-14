import React, { Component } from 'react';
import ChefForm from './ChefForm';
import SigninButton from './SigninButton';
import { InfoWindowContent } from './InfoWindowContent';
import { events } from './TestEvents';
const initialOffset = 0.00068;

export default class App extends Component {
  constructor() {
    super();
    this.state = { toggle: 0 };
  }
  componentDidMount() {
    this.initMap();
    this.populateMap();
  }

  addMarker(event) {
    const marker = new google.maps.Marker({
      position: event.pos,
      map: this.map
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
    const map = this.map;
    for (let chef of events) {
      this.addMarker(chef);
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
    this.map = map;
    const infoWindow = new google.maps.InfoWindow();

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
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
        <SigninButton/>
        <button onClick={this.toggle.bind(this)}>Toggle </button>
        <ChefForm addMarker={this.addMarker.bind(this)} />
      </div>
    );
  }
}
