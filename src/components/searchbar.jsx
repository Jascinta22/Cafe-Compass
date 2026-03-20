import { Autocomplete } from "@react-google-maps/api";
import { useRef } from "react";

function SearchBar({ setLocation }) {
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  // Fires when user selects a suggestion from the dropdown
  const onPlaceChanged = () => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();

    if (!place.geometry) {
      findPlaceFromText(inputRef.current?.value);
    } else {
      setLocation({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
    // Close the dropdown by blurring the input
    inputRef.current?.blur();
  };

  // Uses AutocompleteService + PlacesService (both part of Places API — no extra API needed)
  const findPlaceFromText = (text) => {
    if (!text) return;

    const autocompleteService = new window.google.maps.places.AutocompleteService();
    autocompleteService.getPlacePredictions({ input: text }, (predictions, status) => {
      if (
        status !== window.google.maps.places.PlacesServiceStatus.OK ||
        !predictions ||
        predictions.length === 0
      ) {
        console.warn("No predictions found for:", text);
        return;
      }

      const dummyDiv = document.createElement("div");
      const placesService = new window.google.maps.places.PlacesService(dummyDiv);
      placesService.getDetails(
        { placeId: predictions[0].place_id, fields: ["geometry"] },
        (place, detailStatus) => {
          if (
            detailStatus === window.google.maps.places.PlacesServiceStatus.OK &&
            place?.geometry
          ) {
            setLocation({
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            });
          }
        }
      );
    });
  };

  // Fires when user presses Enter without selecting from dropdown
  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      findPlaceFromText(e.target.value);
      e.target.blur(); // Close the dropdown
    }
  };

  return (
    <Autocomplete
      onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
      onPlaceChanged={onPlaceChanged}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Search place or country..."
        onKeyDown={onKeyDown}
        style={{
          width: "260px",
          height: "40px",
          padding: "10px 15px",
          borderRadius: "8px",
          border: "1px solid #8B5E3C",
          outline: "none",
          fontSize: "14px",
          fontWeight: "500",
          background: "#F5E9D4",
          color: "#5C3A21",
          fontFamily: "'Segoe UI', sans-serif",
        }}
      />
    </Autocomplete>
  );
}

export default SearchBar;
