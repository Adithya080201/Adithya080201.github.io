import logo from "./logo.svg";
import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Map from "./components/Map";

const App = () => {
  const [path, setPath] = useState([]);
  const [stoppages, setStoppages] = useState([]);
  const thresholdMinutes = 5; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        // I used a python script to convert the csv file to JSON file
        const response = await axios.get("/gpsData.json");
        const data = response.data;

        if (data && data.length > 0) {
          const stoppages = identifyStoppages(data, thresholdMinutes);
          setPath(data);
          setStoppages(stoppages);
        } else {
          console.error("No data available");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const identifyStoppages = (data, thresholdMinutes) => {
    const stoppages = [];
    const threshold = thresholdMinutes * 60 * 1000;
    let i = 0;

    while (i < data.length - 1) {
      let start = data[i];
      let end = start;
      while (i < data.length - 1 && data[i].speed === 0) {
        end = data[i];
        i++;
      }
      if (new Date(end.eventDate) - new Date(start.eventDate) > threshold) {
        stoppages.push({
          latitude: start.latitude,
          longitude: start.longitude,
          reach_time: start.eventDate,
          end_time: end.eventDate,
          duration_minutes:
            (new Date(end.eventDate) - new Date(start.eventDate)) / 60000,
        });
      }
      i++;
    }

    return stoppages;
  };

  if (!path.length) {
    return <div>Loading...</div>; 
  }

  return (
    <div>
      <h1>GPS Data Visualization</h1>
      <Map path={path} stoppages={stoppages} />
    </div>
  );
};

export default App;
