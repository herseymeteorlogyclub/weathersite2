// App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";

////////////////////////////////////////////////////////////////////////////////
//                                  CONSTANTS                                 //
////////////////////////////////////////////////////////////////////////////////

// Arlington Heights, IL coords
const LAT = 41.9759;
const LON = -87.9291;
const POINTS_URL = `https://api.weather.gov/points/${LAT},${LON}`;

////////////////////////////////////////////////////////////////////////////////
//                                  STYLES                                    //
////////////////////////////////////////////////////////////////////////////////

const headerStyle = {
  position: "relative", width: "100vw", left: "50%", marginLeft: "-50vw",
  backgroundColor: "#F26724", color: "white", padding: "32px 0",
  textAlign: "center", fontSize: "2.5rem", fontWeight: "bold",
  letterSpacing: "2px", borderRadius: "0 0 16px 16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.12)", zIndex: 1
};

const homeButtonStyle = {
  position: "absolute", top: "16px", left: "16px",
  background: "transparent", border: "none", color: "white",
  fontSize: "1.6rem", cursor: "pointer", zIndex: 2
};

const menuButtonStyle = {
  position: "absolute", top: "16px", left: "48px",
  background: "transparent", border: "none", color: "white",
  fontSize: "1.8rem", cursor: "pointer", zIndex: 2
};

const menuStyle = {
  position: "absolute", top: "100%", left: 0,
  backgroundColor: "#fff", width: "200px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  borderRadius: "0 0 8px 8px", overflow: "hidden"
};

const menuItemStyle = {
  display: "block", width: "100%", padding: "8px 12px",
  fontSize: "0.9rem", lineHeight: 1.2, color: "#000",
  background: "white", border: "none", textAlign: "left",
  cursor: "pointer"
};

const tickerContainerStyle = {
  position: "relative", width: "100vw", left: "50%",
  marginLeft: "-50vw", overflow: "hidden", background: "#8B4513",
  color: "white", borderBottomLeftRadius: "12px",
  borderBottomRightRadius: "12px", height: "40px",
  display: "flex", alignItems: "center", marginBottom: "32px"
};

const tickerTextStyle = {
  display: "inline-block", whiteSpace: "nowrap",
  fontWeight: 500, fontSize: "1.1rem", letterSpacing: "1px",
  paddingLeft: "100vw", animation: "ticker-scroll 18s linear infinite"
};

const keyframes = `
@keyframes ticker-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}
`;

const pageContainerStyle = {
  maxWidth: 600, margin: "auto", padding: 20,
  background: "#f0f0f0", minHeight: "100vh", position: "relative"
};

const sectionStyle = {
  border: "2px solid #F26724", borderRadius: "8px",
  padding: "16px", marginBottom: "32px", background: "#fff"
};

const miniStyle = {
  position: "absolute", top: "16px", right: "16px",
  background: "rgba(255,255,255,0.9)", padding: "8px 12px",
  borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  cursor: "pointer", display: "flex", flexDirection: "column",
  alignItems: "center", zIndex: 3
};

const forecastGridStyle = {
  display: "flex", justifyContent: "space-between",
  flexWrap: "wrap", gap: "12px"
};

const cardStyle = {
  flex: "1 1 100px", background: "#e0f7fa",
  padding: "12px", borderRadius: "8px", textAlign: "center",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
};

////////////////////////////////////////////////////////////////////////////////
//                                SAMPLE DATA                                 //
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
  const goTo = path => { navigate(path); setMenuOpen(false); };

  return (
    <header style={headerStyle}>
      <button style={homeButtonStyle} onClick={() => goTo("/")}>🏠</button>
      <button style={menuButtonStyle} onClick={() => setMenuOpen(o => !o)}>☰</button>
      Hersey Meteorology Club
      {menuOpen && (
        <nav style={menuStyle}>
          <button style={menuItemStyle} onClick={() => goTo("/about")}>About</button>
          <button style={menuItemStyle} onClick={() => goTo("/updates")}>Meeting Updates</button>
          <button style={menuItemStyle} onClick={() => goTo("/schedule")}>Schedule</button>
          <button style={{ ...menuItemStyle, borderBottom: "none" }} onClick={() => goTo("/contact")}>Contact Information</button>
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
//                         MINI WEATHER WIDGET                                //
////////////////////////////////////////////////////////////////////////////////

function MiniWeatherWidget() {
  const [now, setNow]       = useState(null);
  const [loading, setLoad]  = useState(true);
  const [error, setError]   = useState(null);
  const navigate            = useNavigate();

  useEffect(() => {
    let mounted = true;
    let intervalId;

    async function fetchNow() {
      try {
        const pt = await axios.get(POINTS_URL);
        const hr = await axios.get(pt.data.properties.forecastHourly);
        if (!mounted) return;
        setNow(hr.data.properties.periods[0]);
        setError(null);
      } catch (e) {
        if (!mounted) return;
        setError(e.message);
      } finally {
        if (!mounted) return;
        setLoad(false);
      }
    }

    fetchNow();
    intervalId = setInterval(fetchNow, 300000);
    return () => { mounted = false; clearInterval(intervalId); };
  }, []);

  if (loading || error || !now) return null;

  return (
    <div style={miniStyle} onClick={() => navigate("/forecast")}>
      <div style={{ fontSize: "1.4rem" }}>{now.shortForecast}</div>
      <div style={{ fontWeight: "bold", fontSize: "1.3rem" }}>
        {Math.round(now.temperature)}°F
      </div>
      <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>
        at {new Date(now.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>
    </div>
  );
}

////////////////////////////////////////////////////////////////////////////////
//                            SATELLITE COMPONENT                             //
////////////////////////////////////////////////////////////////////////////////

function GoesSatellite() {
  const [imgSrc, setImgSrc] = useState(
    "https://cdn.star.nesdis.noaa.gov/GOES16/ABI/SECTOR/umv/GEOCOLOR/latest.jpg" +
    `?cacheBust=${Date.now()}`
  );

  useEffect(() => {
    const id = setInterval(() => {
      setImgSrc(
        "https://cdn.star.nesdis.noaa.gov/GOES16/ABI/SECTOR/umv/GEOCOLOR/latest.jpg" +
        `?cacheBust=${Date.now()}`
      );
    }, 300000);
    return () => clearInterval(id);
  }, []);

  return (
    <section style={sectionStyle}>
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
          View live & animated images
        </a>
      </div>
    </section>
  );
}

////////////////////////////////////////////////////////////////////////////////
//                            FORECAST PAGE                                  //
////////////////////////////////////////////////////////////////////////////////

function ForecastPage() {
  const [days, setDays]     = useState([]);
  const [loading, setLoad]  = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchForecast() {
      try {
        const pt = await axios.get(POINTS_URL);
        const fc = await axios.get(pt.data.properties.forecast);
        if (!mounted) return;
        const dias = fc.data.properties.periods
          .filter(p => p.isDaytime)
          .slice(1, 6);
        setDays(dias);
        setError(null);
      } catch (e) {
        if (!mounted) return;
        setError(e.message);
      } finally {
        if (!mounted) return;
        setLoad(false);
      }
    }
    fetchForecast();
    return () => { mounted = false; };
  }, []);

  if (loading) return (
    <section style={sectionStyle}>
      <h2>5-Day Forecast</h2>
      <p>Loading…</p>
    </section>
  );

  if (error) return (
    <section style={sectionStyle}>
      <h2>5-Day Forecast</h2>
      <p>Failed to load: {error}</p>
    </section>
  );

  return (
    <section style={sectionStyle}>
      <h2>5-Day Forecast</h2>
      <div style={forecastGridStyle}>
        {days.map((d, i) => (
          <div key={i} style={cardStyle}>
            <div style={{ fontWeight: "bold" }}>
              {new Date(d.startTime).toLocaleDateString(undefined, {
                weekday: "short", month: "short", day: "numeric"
              })}
            </div>
            <div style={{ margin: "8px 0" }}>{d.shortForecast}</div>
            <div>High {Math.round(d.temperature)}°F</div>
          </div>
        ))}
      </div>
    </section>
  );
}

////////////////////////////////////////////////////////////////////////////////
//                           OTHER PAGES                                     //
////////////////////////////////////////////////////////////////////////////////

function HomePage() {
  return (
    <>
      <GoesSatellite />
    </>
  );
}

function AboutPage() {
  return (
    <section style={sectionStyle}>
      <h2>About</h2>
      <p>This club is dedicated to exploring meteorology and atmospheric sciences.</p>
    </section>
  );
}

function UpdatesPage() {
  return (
    <section style={sectionStyle}>
      <h2>Meeting Updates</h2>
      <ul>
        {updates.map((u,i) => (
          <li key={i}><strong>{u.date}:</strong> {u.text}</li>
        ))}
      </ul>
    </section>
  );
}

function SchedulePage() {
  return (
    <section style={sectionStyle}>
      <h2>Schedule</h2>
      <p>Weekly meetings: Thursdays at 3:30 PM, Room 101.</p>
    </section>
  );
}

function ContactPage() {
  return (
    <section style={sectionStyle}>
      <h2>Contact Information</h2>
      <p>Email: info@herseymeteorology.org<br/>Phone: (555) 123-4567</p>
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
      <MiniWeatherWidget />
      <div style={pageContainerStyle}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/forecast" element={<ForecastPage />} />
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