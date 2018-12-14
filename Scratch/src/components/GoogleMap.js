import React, { Component } from 'react';

export default class GoogleMap extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    this.initMap();
  }

  initMap() {
    // The location of Uluru
    var uluru = { lat: -25.344, lng: 131.036 };
    // The map, centered at Uluru
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: uluru
    });

    console.log(document.getElementById('map'));

    const infoWindow = new google.maps.InfoWindow();

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent('Your location.');
          infoWindow.open(map);
          map.setCenter(pos);
          map.setZoom(4);
          // The marker, positioned at Uluru
          var marker = new google.maps.Marker({ position: pos, map: map });
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
  render() {
    return <div id="map" />;
  }
}
