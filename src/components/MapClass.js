import React, { Component } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  SVGOverlay,
} from "react-leaflet";
import "../style.css";
import Location from "./Location";
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import firebase from "firebase/app";
import L from "leaflet"
// Add the Firebase services that you want to use
import "firebase/firestore";
import FoundImage from "../red.png";
//--------------------------------------------------------------------------
var firebaseConfig = {
  apiKey: "AIzaSyClDJ0bwlAf5EQQ1yLI6ZsqymZLa1j2dZw",
  authDomain: "ndfman-b3a08.firebaseapp.com",
  databaseURL: "https://ndfman-b3a08-default-rtdb.firebaseio.com",
  projectId: "ndfman-b3a08",
  storageBucket: "ndfman-b3a08.appspot.com",
  messagingSenderId: "785096111400",
  appId: "1:785096111400:web:ff5acef24139b9d80f4c1d",
  measurementId: "G-RP4N82QFDW",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}
var db = firebase.firestore();

//--------------------------------------------------------------------------
export default class MapClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }
  componentWillMount() {
    this.renderData();
  }
  renderData() {
    let fetched_data = [];
    db.collection("Cluster")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          let items = doc.data();
          fetched_data.push([items.Latitude, items.Longitude, items.numPeople]);
          this.setState({ data: fetched_data });
        });
      });
  }
  render() {
    const image = L.icon({
      iconUrl: FoundImage,
      // shadowUrl: '../red.png',
      iconSize:     [50, 50], // size of the icon
      shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
  
    let data = this.state.data;
    console.log("data fetched");
    console.log(data);
    return (
      <MapContainer
        id="map"
        center={[50.5, 30.5]}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {this.state.data ? (
          data.map((event) => (
            <Marker icon={image} position={[event[0], event[1]]}>
              <Popup>There are {event[2]} people here.</Popup>
            </Marker>
          ))
        ) : (
          <h1>No data fetched</h1>
        )}

        <Location />
      </MapContainer>
    );
  }
}
