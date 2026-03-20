function FavouritesPanel({ favourites, setFavourites, darkMode, onSelectCafe }) {
  const bg = darkMode ? "#1a1a2e" : "#fff";
  const titleColor = darkMode ? "#D9B382" : "#5C3A21";
  const cardBg = darkMode ? "#2a2a4e" : "#fdf6ec";
  const border = darkMode ? "#3a3a6e" : "#e8d5b7";
  const subColor = darkMode ? "#aaa" : "#7a5230";

  const removeFav = (id) => {
    setFavourites((prev) => prev.filter((f) => f._id !== id));
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 80,
        right: 20,
        zIndex: 20,
        width: 300,
        maxHeight: "70vh",
        overflowY: "auto",
        background: bg,
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
        padding: "16px",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <h3 style={{ margin: "0 0 12px", color: titleColor, fontSize: "16px" }}>
        ❤️ My Favourites ({favourites.length})
      </h3>

      {favourites.length === 0 && (
        <p style={{ color: "#999", fontSize: "13px", margin: 0 }}>
          No saved cafes yet. Click ❤️ on a marker to save!
        </p>
      )}

      {favourites.map((cafe) => {
        const name =
          typeof cafe.displayName === "object"
            ? cafe.displayName.text
            : cafe.displayName;

        return (
          <div
            key={cafe._id}
            style={{
              background: cardBg,
              border: `1px solid ${border}`,
              borderRadius: "8px",
              padding: "10px",
              marginBottom: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            {/* Cafe info — clickable to fly there */}
            <div
              onClick={() => onSelectCafe(cafe)}
              style={{ cursor: "pointer", flex: 1 }}
            >
              <p
                style={{
                  margin: "0 0 3px",
                  fontWeight: "700",
                  color: titleColor,
                  fontSize: "13px",
                }}
              >
                ☕ {name}
              </p>
              {cafe.rating && (
                <p style={{ margin: "0 0 2px", fontSize: "12px", color: "#f5a623" }}>
                  {"★".repeat(Math.round(cafe.rating))} {cafe.rating.toFixed(1)}
                </p>
              )}
              {cafe.formattedAddress && (
                <p style={{ margin: 0, fontSize: "11px", color: subColor }}>
                  📍{" "}
                  {cafe.formattedAddress.length > 50
                    ? cafe.formattedAddress.slice(0, 50) + "…"
                    : cafe.formattedAddress}
                </p>
              )}
            </div>

            {/* Remove button */}
            <button
              onClick={() => removeFav(cafe._id)}
              title="Remove from favourites"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#e74c3c",
                fontSize: "16px",
                padding: "0 0 0 8px",
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default FavouritesPanel;
