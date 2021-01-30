import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  SVGOverlay,
} from "react-leaflet";
import "../style.css";

// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/firestore";

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
function Location() {
  const [position, setPosition] = useState(null);
  const map = useMapEvents({
    mouseover() {
      map.locate();
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

export default function Map() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    await db.collection("Cluster")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          let items = doc.data();
          data.push([items.Latitude, items.Longitude, items.numPeople]);
        });
      });
  };
  
  if (data.length == 0) {
    console.log("Empty data")
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
        <Location />
      </MapContainer>
    );
  } else {
    console.log("data fetched")
    console.log(data)
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
        {data.map((event) => (
          <Marker position={[event[0], event[1]]}>
            <Popup>There are {event[3]} people found here.</Popup>
          </Marker>
        ))}
        <Location />
      </MapContainer>
    );
  }
}
