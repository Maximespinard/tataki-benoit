import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import axios from "axios";

import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PaletteIcon from "@mui/icons-material/Palette";
import SportsIcon from "@mui/icons-material/Sports";
import CasinoIcon from "@mui/icons-material/Casino";
import GroupIcon from "@mui/icons-material/Group";
import BrushIcon from "@mui/icons-material/Brush";

import "leaflet/dist/leaflet.css";

const categoryIcons = {
  Musique: <MusicNoteIcon />,
  "Arts visuels": <PaletteIcon />,
  Sports: <SportsIcon />,
  "Jeux de rôle": <CasinoIcon />,
  "Jeux de société": <GroupIcon />,
  "Arts créatifs": <BrushIcon />,
};

export const Map = () => {
  const [markers, setMarkers] = useState([]);
  const [position, setPosition] = useState([43.604652, 1.444209]);
  const [isFetching, setIsFetching] = useState(true);

  const mapRef = useRef();

  // Fonction to add a marker
  const MapEvents = () => {
    useMapEvents({
      click(e) {
        console.log(e.latlng.lat);
        console.log(e.latlng.lng);
      },
    });
    return false;
  };

  // fetch data from backend
  useEffect(() => {
    setIsFetching(true);
    axios
      .get("http://localhost:5000/locations")
      .then((res) => {
        setMarkers(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  // Fonction pour obtenir la position actuelle du navigateur
  useEffect(() => {
    const getCurrentPosition = () => {
      if (navigator.geolocation) {
        // get current position from browser
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setPosition([latitude, longitude]);
          },
          (error) => {
            console.error(error);
            // set default position
            setPosition([43.604652, 1.444209]);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        // set default position
        setPosition([43.604652, 1.444209]);
      }
    };

    getCurrentPosition();
  }, []);

  if (isFetching && position[0] === 0 && position[1] === 0) {
    return <p>Loading...</p>;
  }

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      <MapEvents />
      {markers.map((marker, index) => (
        <Marker position={[marker.lat, marker.lng]} key={index}>
          <Popup>
            <div>
              <h2>Description du point</h2>
              <p>Infos: {marker.text}</p>
              {categoryIcons[marker.category]}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
