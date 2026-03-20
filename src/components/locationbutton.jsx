function LocationButton({ setLocation, setUserLocation, darkMode }) {
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const coords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      setLocation(coords);
      setUserLocation(coords);
    });
  };

  return (
    <button
      onClick={getLocation}
      style={{
        padding: "10px 14px",
        borderRadius: "8px",
        border: "none",
        background: darkMode ? "#2a2a5e" : "#8B5E3C",
        color: "#F5E9D4",
        fontWeight: "600",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        fontFamily: "'Segoe UI', sans-serif",
        fontSize: "14px",
        transition: "transform 0.1s",
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      📍 Use Current Location
    </button>
  );
}

export default LocationButton;
