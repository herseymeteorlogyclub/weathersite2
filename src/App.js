import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

// Header style: full width
const headerStyle = {
  width: "100vw",
  position: "relative",
  left: "50%",
  right: "50%",
  marginLeft: "-50vw",
  marginRight: "-50vw",
  backgroundColor: "#F26724",
  color: "white",
  padding: "32px 0",
  textAlign: "center",
  fontSize: "2.5rem",
  fontWeight: "bold",
  letterSpacing: "2px",
  marginBottom: "0px",
  borderRadius: "0 0 16px 16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
  zIndex: 1,
};

// Ticker style
const tickerContainerStyle = {
  width: "100vw",
  overflow: "hidden",
  background: "#513628",
  color: "white",
  borderBottomLeftRadius: "12px",
  borderBottomRightRadius: "12px",
  marginBottom: "32px",
  position: "relative",
  left: "50%",
  right: "50%",
  marginLeft: "-50vw",
  marginRight: "-50vw",
  height: "40px",
  display: "flex",
  alignItems: "center",
};

const tickerTextStyle = {
  display: "inline-block",
  whiteSpace: "nowrap",
  fontWeight: "500",
  fontSize: "1.1rem",
  letterSpacing: "1px",
  paddingLeft: "100vw",
  animation: "ticker-scroll 12s linear infinite",
};

const keyframes = `
@keyframes ticker-scroll {
  0% { transform: translateX(0);}
  100% { transform: translateX(-100%);}
}
`;

// Meeting Updates Data
const updates = [
  { date: "2025-08-05", text: "First meeting of the year! Room 101, 3:30pm." },
  { date: "2025-08-12", text: "Guest speaker: Local meteorologist." }
];

// Ticker Component
function MeetingTicker() {
  // Combine updates into a single string, separated by " • "
  const tickerStr = updates.map(u => `${u.date}: ${u.text}`).join("   •   ");
  return (
    <div style={tickerContainerStyle}>
      {/* Inject keyframes in the document head */}
      <style>{keyframes}</style>
      <span style={tickerTextStyle}>{tickerStr}</span>
    </div>
  );
}

// Meeting Updates Component (for main content)
function MeetingUpdates() {
  return (
    <section>
      <h2>Meeting Updates</h2>
      <ul>
        {updates.map((u, i) => (
          <li key={i}>
            <strong>{u.date}:</strong> {u.text}
          </li>
        ))}
      </ul>
    </section>
  );
}

// Weather Widget Component
function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cityId = "4889284"; // Arlington Heights, IL, US
  const apiKey = "45a3169127ee4112afb9beab62d91491"; // Replace with your valid API key

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&units=imperial&appid=${apiKey}`
      )
      .then((response) => {
        setWeather(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Could not fetch weather data.");
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <section>
        <h2>Current Weather</h2>
        <p>Loading...</p>
      </section>
    );
  if (error)
    return (
      <section>
        <h2>Current Weather</h2>
        <p>{error}</p>
      </section>
    );

  return (
    <section>
      <h2>Current Weather</h2>
      <p>
        {weather.name}: {weather.weather[0].description}
        <br />
        Temp: {weather.main.temp}°F, Feels like: {weather.main.feels_like}°F
        <br />
        Humidity: {weather.main.humidity}%
      </p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      />
    </section>
  );
}

// GOES-East Upper Mississippi Valley Satellite Component
function GoesSatellite() {
  const [imgSrc, setImgSrc] = useState(getImageUrl());

  function getImageUrl() {
    // Add a cache buster
    return `https://cdn.star.nesdis.noaa.gov/GOES16/ABI/SECTOR/umv/GEOCOLOR/latest.jpg?cacheBust=${Date.now()}`;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setImgSrc(getImageUrl());
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <section>
      <h2>GOES-East: Upper Mississippi Valley</h2>
      <img
        src={imgSrc}
        alt="GOES-East Upper Mississippi Valley Satellite"
        style={{ maxWidth: "100%", borderRadius: "8px", marginBottom: "10px" }}
      />
      <div>
        <a
          href="https://www.star.nesdis.noaa.gov/GOES/sector.php?sat=gm&sector=umv"
          target="_blank"
          rel="noopener noreferrer"
        >
          View live and animated images
        </a>
      </div>
    </section>
  );
}

function App() {
  return (
    <>
      <header style={headerStyle}>
        Hersey Meteorology Club
      </header>
      <MeetingTicker />
      <div className="App" style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
        <main>
          <MeetingUpdates />
          <WeatherWidget />
          <GoesSatellite />
        </main>
      </div>
    </>
  );
}

export default App;