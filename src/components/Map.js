import React from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Map = ({ path, stoppages }) => {
  
  const initialPosition =
    path.length > 0 ? [path[0].latitude, path[0].longitude] : [0, 0];

  return (
    <MapContainer
      center={initialPosition}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Polyline
        positions={path.map((point) => [point.latitude, point.longitude])}
        color="blue"
      />
      {stoppages.map((stop, idx) => (
        <Marker key={idx} position={[stop.latitude, stop.longitude]}>
          <Popup>
            <div>
              <p>Reach Time: {new Date(stop.reach_time).toLocaleString()}</p>
              <p>End Time: {new Date(stop.end_time).toLocaleString()}</p>
              <p>Duration: {stop.duration_minutes.toFixed(2)} minutes</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
