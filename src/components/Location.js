import React, { useState } from "react";
import { Marker, Popup, useMapEvents, SVGOverlay } from "react-leaflet";

export default function Location() {
  
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
