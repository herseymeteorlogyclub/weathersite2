import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";

////////////////////////////////////////////////////////////////////////////////
//                                 STYLES                                    //
////////////////////////////////////////////////////////////////////////////////

const headerStyle = {
  width: "100vw",
  left: "50%",
  marginLeft: "-50vw",
  position: "relative",
  backgroundColor: "#F26724",
  color: "white",
  padding: "32px 0",
  textAlign: "center",
  fontSize: "2.5rem",
  fontWeight: "bold",
  letterSpacing: "2px",
  marginBottom: 0,
  borderRadius: "0 0 16px 16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
  zIndex: 1
};

const homeButtonStyle = {
  position: "absolute",
  top: "16px",
  left: "16px",
  background: "transparent",
  border: "none",
  color: "white",
  fontSize: "1.6rem",
  cursor: "pointer",
  zIndex: 2
};

const menuButtonStyle = {
  position: "absolute",
  top: "16px",
  left: "48px",
  background: "transparent",
  border: "none",
  color: "white",
  fontSize: "1.8rem",
  cursor: "pointer",
  zIndex: 2
};

const menuStyle = {
  position: "absolute",
  top: "100%",
  left: 0,
  backgroundColor: "#fff",
  width: "200px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  borderRadius: "0 0 8px 8px",
  overflow: "hidden"
};

const menuItemStyle = {
  display: "block",
  width: "100%",
  padding: "8px 12px",
  fontSize: "0.9rem",
  lineHeight: 1.2,
  color: "#000",
  background: "white",
  border: "none",
  textAlign: "left",
  cursor: "pointer"
};

const tickerContainerStyle = {
  width: "100vw",
  left: "50%",
  marginLeft: "-50vw",
  overflow: "hidden",
  background: "#8B4513",
  color: "white",
  borderBottomLeftRadius: "12px",
  borderBottomRightRadius: "12px",
  marginBottom: "32px",
  position: "relative",
  height: "40px",
  display: "flex",
  alignItems: "center"
};

const tickerTextStyle = {
  display: "inline-block",
  whiteSpace: "nowrap",
  fontWeight: 500,
  fontSize: "1.1rem",
  letterSpacing: "1px",
  paddingLeft: "100vw",
  animation: "ticker-scroll 18s linear infinite"
};

const keyframes = `
@keyframes ticker-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}
`;

const pageContainerStyle = {
  maxWidth: 600,
  margin: "auto",
  padding: 20,
  background: "#f0f0f0",
  minHeight: "100vh"
};

const satelliteSectionStyle = {
  border: "2px solid #F26724",
  borderRadius: "8px",
  padding: "10px",
  marginBottom: "32px"
};

////////////////////////////////////////////////////////////////////////////////
//                             SAMPLE DATA                                   //
////////////////////////////////////////////////////////////////////////////////

const updates = [
  { date: "2025-08-05", text: "First meeting of the year! Room 101, 3:30pm." },
  { date: "2025-08-12", text: "Guest speaker: Local meteorologist." }
];

////////////////////////////////////////////////////////////////////////////////
//                          SHARED COMPONENTS                                //
////////////////////////////////////////////////////////////////////////////////

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const goTo = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <header style={headerStyle}>
      <button
        style={homeButtonStyle}
        aria-label="Home"
        onClick={() => goTo("/")}
      >
        🏠
      </button>

      <button
        style={menuButtonStyle}
        aria-label="Toggle menu"
        onClick={() => setMenuOpen(o => !o)}
      >
        ☰
      </button>

      Hersey Meteorology Club

      {menuOpen && (
        <nav style={menuStyle}>
          <button style={menuItemStyle} onClick={() => goTo("/about")}>
            About
          </button>
          <button style={menuItemStyle} onClick={() => goTo("/updates")}>
            Meeting Updates
          </button>
          <button style={menuItemStyle} onClick={() => goTo("/schedule")}>
            Schedule
          </button>
          <button
            style={{ ...menuItemStyle, borderBottom: "none" }}
            onClick={() => goTo("/contact")}
          >
            Contact Information
          </button>
        </nav>
      )}
    </header>
  );
}

function MeetingTicker() {
  const tickerStr = updates.map(u => `${u.date}: ${u.text}`).join("   •   ");
  return (
    <div style={tickerContainerStyle}>
      <style>{keyframes}</style>
      <span style={tickerTextStyle}>{tickerStr}</span>
    </div>
  );
}

////////////////////////////////////////////////////////////////////////////////
//                          FEATURE COMPONENTS                              //
////////////////////////////////////////////////////////////////////////////////

function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cityId = "4889284";
  const apiKey = "45a3169127ee4112afb9beab62d91491"; 

  useEffect(() => {
    axios
      .get("https://api.openweathermap.org/data/2.5/weather", {
        params: { id: cityId, units: "imperial", appid: apiKey }
      })
      .then(resp => {
        setWeather(resp.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not fetch weather data.");
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <section>
      <h2>Current Weather</h2>
      <p>Loading...</p>
    </section>
  );
  if (error) return (
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

function GoesSatellite() {
  const [imgSrc, setImgSrc] = useState(getUrl());

  function getUrl() {
    return `https://cdn.star.nesdis.noaa.gov/GOES16/ABI/SECTOR/umv/GEOCOLOR/latest.jpg?cacheBust=${Date.now()}`;
  }

  useEffect(() => {
    const id = setInterval(() => setImgSrc(getUrl()), 300_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section style={satelliteSectionStyle}>
      <h2>Current Satellite Imagery</h2>
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

////////////////////////////////////////////////////////////////////////////////
//                           PAGE COMPONENTS                                  //
////////////////////////////////////////////////////////////////////////////////

function HomePage() {
  return (
    <>
      <WeatherWidget />
      <GoesSatellite />
    </>
  );
}

function AboutPage() {
  return (
    <section>
      <h2>About</h2>
      <p>This club is dedicated to exploring meteorology and atmospheric sciences.</p>
    </section>
  );
}

function UpdatesPage() {
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

function SchedulePage() {
  return (
    <section>
      <h2>Schedule</h2>
      <p>Our weekly meetings are every Thursday at 3:30pm in Room 101.</p>
    </section>
  );
}

function ContactPage() {
  return (
    <section>
      <h2>Contact Information</h2>
      <p>
        Email: info@herseymeteorology.org<br />
        Phone: (555) 123-4567
      </p>
    </section>
  );
}

////////////////////////////////////////////////////////////////////////////////
//                                ROOT APP                                   //
////////////////////////////////////////////////////////////////////////////////

function App() {
  return (
    <Router>
      <Header />
      <MeetingTicker />
      <div style={pageContainerStyle}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/updates" element={<UpdatesPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;