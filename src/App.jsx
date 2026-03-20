import { useLoadScript } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import SearchBar from "./components/searchbar.jsx";
import LocationButton from "./components/locationbutton.jsx";
import MapView from "./components/mapview.jsx";
import FavouritesPanel from "./components/FavouritesPanel.jsx";

const libraries = ["places"];

function App() {
  const [location, setLocation] = useState({ lat: 10.8505, lng: 76.2711 });
  const [userLocation, setUserLocation] = useState(null);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("cafecompass-dark") === "true";
  });

  const [favourites, setFavourites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cafecompass-favs") || "[]");
    } catch {
      return [];
    }
  });

  const [showFavourites, setShowFavourites] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // Get GPS on startup
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
  }, []);

  // Persist dark mode + toggle body class for autocomplete CSS
  useEffect(() => {
    localStorage.setItem("cafecompass-dark", darkMode);
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  // Persist favourites
  useEffect(() => {
    localStorage.setItem("cafecompass-favs", JSON.stringify(favourites));
  }, [favourites]);

  if (!isLoaded)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#A67B5B",
          color: "#fff",
          fontSize: "1.5rem",
          fontFamily: "sans-serif",
        }}
      >
        Loading maps...
      </div>
    );

  const topBarBg = darkMode ? "#16213e" : "#D9B382";
  const titleColor = darkMode ? "#D9B382" : "#5C3A21";
  const btnStyle = {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "none",
    background: darkMode ? "#2a2a5e" : "#8B5E3C",
    color: "#F5E9D4",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: "14px",
    position: "relative",
  };

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      {/* Top Bar */}
      <div
        style={{
          position: "absolute",
          top: 15,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: topBarBg,
          padding: "10px 20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          whiteSpace: "nowrap",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "24px" }}>☕</span>
          <span style={{ fontWeight: "700", color: titleColor, fontSize: "18px", fontFamily: "'Segoe UI', sans-serif" }}>
            CafeCompass
          </span>
        </div>

        <SearchBar setLocation={setLocation} darkMode={darkMode} />

        <LocationButton setLocation={setLocation} setUserLocation={setUserLocation} darkMode={darkMode} />

        {/* Favourites Button */}
        <button
          onClick={() => setShowFavourites((v) => !v)}
          style={btnStyle}
          title="My Favourites"
        >
          ❤️ Saved
          {favourites.length > 0 && (
            <span
              style={{
                position: "absolute",
                top: -7,
                right: -7,
                background: "#e74c3c",
                color: "#fff",
                borderRadius: "50%",
                width: 18,
                height: 18,
                fontSize: "11px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
              }}
            >
              {favourites.length}
            </span>
          )}
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode((v) => !v)}
          title={darkMode ? "Light Mode" : "Dark Mode"}
          style={{
            ...btnStyle,
            background: darkMode ? "#D9B382" : "#5C3A21",
            color: darkMode ? "#5C3A21" : "#D9B382",
            fontSize: "18px",
            padding: "8px 12px",
          }}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      {/* Favourites Panel */}
      {showFavourites && (
        <FavouritesPanel
          favourites={favourites}
          setFavourites={setFavourites}
          darkMode={darkMode}
          onSelectCafe={(cafe) => {
            setLocation({ lat: cafe.location.latitude, lng: cafe.location.longitude });
            setShowFavourites(false);
          }}
        />
      )}

      {/* Map */}
      <MapView
        location={location}
        userLocation={userLocation}
        darkMode={darkMode}
        favourites={favourites}
        setFavourites={setFavourites}
      />
    </div>
  );
}

export default App;