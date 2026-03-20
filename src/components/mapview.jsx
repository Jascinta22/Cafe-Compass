import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { useEffect, useState } from "react";

// Haversine formula — straight-line distance in km
function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Star rating display
function StarRating({ rating }) {
  if (!rating) return null;
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span style={{ color: "#f5a623", fontSize: "14px", letterSpacing: "1px" }}>
      {"★".repeat(full)}
      {half ? "½" : ""}
      {"☆".repeat(empty)}
    </span>
  );
}

// Google Maps dark night style
const DARK_MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
  { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
  { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
];

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function MapView({ location, userLocation, darkMode, favourites, setFavourites }) {
  const [cafes, setCafes] = useState([]);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    if (!location) return;
    setCafes([]);
    setSelectedCafe(null);

    const fetchCafes = async () => {
      try {
        const res = await fetch(
          "https://places.googleapis.com/v1/places:searchText",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": API_KEY,
              "X-Goog-FieldMask": [
                "places.displayName",
                "places.location",
                "places.rating",
                "places.userRatingCount",
                "places.formattedAddress",
                "places.regularOpeningHours",
                "places.reviews",
                "places.websiteUri",
                "places.photos",
              ].join(","),
            },
            body: JSON.stringify({
              textQuery: "cafes",
              locationBias: {
                circle: {
                  center: { latitude: location.lat, longitude: location.lng },
                  radius: 2000,
                },
              },
            }),
          }
        );
        const data = await res.json();
        setCafes(
          (data.places || []).filter(
            (c) => c.location?.latitude && c.location?.longitude
          )
        );
      } catch (err) {
        console.error("Error fetching cafes:", err);
      }
    };

    fetchCafes();
  }, [location]);

  const isOpen = (cafe) => cafe.regularOpeningHours?.openNow;

  const getCafeId = (cafe) =>
    `${cafe.location.latitude},${cafe.location.longitude}`;

  const isFavourite = (cafe) =>
    favourites.some((f) => f._id === getCafeId(cafe));

  const toggleFavourite = (cafe) => {
    const id = getCafeId(cafe);
    if (isFavourite(cafe)) {
      setFavourites((prev) => prev.filter((f) => f._id !== id));
    } else {
      setFavourites((prev) => [...prev, { ...cafe, _id: id }]);
    }
  };

  const getPhotoUrl = (cafe) => {
    if (!cafe.photos || cafe.photos.length === 0) return null;
    return `https://places.googleapis.com/v1/${cafe.photos[0].name}/media?maxWidthPx=400&key=${API_KEY}`;
  };

  const getDirectionsUrl = (cafe) => {
    const dest = `${cafe.location.latitude},${cafe.location.longitude}`;
    const origin = userLocation ? `${userLocation.lat},${userLocation.lng}` : "";
    return `https://www.google.com/maps/dir/?api=1&destination=${dest}${origin ? `&origin=${origin}` : ""}`;
  };

  // InfoWindow theme colors
  const iw = {
    bg: darkMode ? "#1a1a2e" : "#fff",
    name: darkMode ? "#D9B382" : "#5C3A21",
    sub: darkMode ? "#a89070" : "#7a5230",
    border: darkMode ? "#3a3a5e" : "#e8d5b7",
    reviewBg: darkMode ? "#2a2a4e" : "#fdf6ec",
    reviewBorder: darkMode ? "#4a4a7e" : "#D9B382",
  };

  return (
    <GoogleMap
      center={location}
      zoom={14}
      mapContainerStyle={{ height: "100vh", width: "100%" }}
      options={{ styles: darkMode ? DARK_MAP_STYLES : [] }}
    >
      {cafes.map((cafe, i) => (
        <Marker
          key={i}
          position={{ lat: cafe.location.latitude, lng: cafe.location.longitude }}
          title={
            typeof cafe.displayName === "object"
              ? cafe.displayName?.text || "Cafe"
              : cafe.displayName || "Cafe"
          }
          onClick={() => setSelectedCafe(cafe)}
          onMouseOver={() => setHoveredIndex(i)}
          onMouseOut={() => setHoveredIndex(null)}
          icon={
            hoveredIndex === i
              ? { url: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png" }
              : { url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }
          }
        />
      ))}

      {selectedCafe && (
        <InfoWindow
          position={{
            lat: selectedCafe.location.latitude,
            lng: selectedCafe.location.longitude,
          }}
          onCloseClick={() => setSelectedCafe(null)}
          options={{ pixelOffset: new window.google.maps.Size(0, -30) }}
        >
          <div
            style={{
              fontFamily: "'Segoe UI', sans-serif",
              maxWidth: "300px",
              padding: "4px 2px",
              color: iw.name,
              background: iw.bg,
              borderRadius: "8px",
            }}
          >
            {/* Photo */}
            {getPhotoUrl(selectedCafe) && (
              <img
                src={getPhotoUrl(selectedCafe)}
                alt="Cafe"
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  marginBottom: "8px",
                  display: "block",
                }}
                onError={(e) => (e.target.style.display = "none")}
              />
            )}

            {/* Name + Favourite */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <h3
                style={{
                  margin: "0 0 6px",
                  fontSize: "15px",
                  fontWeight: "700",
                  color: iw.name,
                  borderBottom: `1px solid ${iw.border}`,
                  paddingBottom: "6px",
                  flex: 1,
                }}
              >
                ☕{" "}
                {typeof selectedCafe.displayName === "object"
                  ? selectedCafe.displayName.text
                  : selectedCafe.displayName}
              </h3>
              <button
                onClick={() => toggleFavourite(selectedCafe)}
                title={isFavourite(selectedCafe) ? "Remove from favourites" : "Save to favourites"}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "20px",
                  padding: "0 0 0 8px",
                  lineHeight: 1,
                }}
              >
                {isFavourite(selectedCafe) ? "❤️" : "🤍"}
              </button>
            </div>

            {/* Rating */}
            {selectedCafe.rating && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "5px" }}>
                <StarRating rating={selectedCafe.rating} />
                <span style={{ fontSize: "13px", color: iw.sub }}>
                  {selectedCafe.rating.toFixed(1)}
                  {selectedCafe.userRatingCount ? ` · ${selectedCafe.userRatingCount} reviews` : ""}
                </span>
              </div>
            )}

            {/* Open/Closed */}
            {selectedCafe.regularOpeningHours && (
              <div style={{ marginBottom: "5px" }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: "10px",
                    fontSize: "11px",
                    fontWeight: "600",
                    background: isOpen(selectedCafe) ? "#d4edda" : "#f8d7da",
                    color: isOpen(selectedCafe) ? "#155724" : "#721c24",
                  }}
                >
                  {isOpen(selectedCafe) ? "✓ Open Now" : "✗ Closed"}
                </span>
              </div>
            )}

            {/* Address */}
            {selectedCafe.formattedAddress && (
              <p style={{ margin: "0 0 5px", fontSize: "12px", color: iw.sub, lineHeight: "1.4" }}>
                📍 {selectedCafe.formattedAddress}
              </p>
            )}

            {/* Distance */}
            {userLocation && (
              <p style={{ margin: "0 0 5px", fontSize: "12px", color: iw.name, fontWeight: "600" }}>
                📏 ~{getDistanceKm(
                  userLocation.lat, userLocation.lng,
                  selectedCafe.location.latitude, selectedCafe.location.longitude
                ).toFixed(1)} km from your location
              </p>
            )}

            {/* Reviews */}
            {selectedCafe.reviews && selectedCafe.reviews.length > 0 && (
              <div style={{ marginTop: "8px" }}>
                <p style={{ margin: "0 0 4px", fontSize: "12px", fontWeight: "600", color: iw.name }}>
                  💬 Reviews
                </p>
                {selectedCafe.reviews.slice(0, 2).map((review, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: iw.reviewBg,
                      borderLeft: `3px solid ${iw.reviewBorder}`,
                      padding: "5px 8px",
                      borderRadius: "4px",
                      marginBottom: "5px",
                      fontSize: "11px",
                      color: darkMode ? "#ccc" : "#5a3b1e",
                      lineHeight: "1.5",
                    }}
                  >
                    <strong style={{ fontSize: "11px", color: iw.sub }}>
                      {review.authorAttribution?.displayName || "Anonymous"}&nbsp;
                      {"★".repeat(Math.round(review.rating || 0))}
                    </strong>
                    <br />
                    {review.text?.text
                      ? review.text.text.slice(0, 120) + (review.text.text.length > 120 ? "…" : "")
                      : "No review text."}
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
              {/* Directions */}
              <a
                href={getDirectionsUrl(selectedCafe)}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-block",
                  padding: "5px 10px",
                  borderRadius: "6px",
                  background: "#4285f4",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                🗺️ Directions
              </a>

              {/* Website */}
              {selectedCafe.websiteUri && (
                <a
                  href={selectedCafe.websiteUri}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-block",
                    padding: "5px 10px",
                    borderRadius: "6px",
                    background: darkMode ? "#2a2a5e" : "#8B5E3C",
                    color: "#F5E9D4",
                    fontSize: "12px",
                    fontWeight: "600",
                    textDecoration: "none",
                  }}
                >
                  🌐 Website
                </a>
              )}
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

export default MapView;
