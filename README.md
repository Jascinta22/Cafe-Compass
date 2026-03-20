☕ CafeCompass
CafeCompass is a modern, feature-rich cafe finder application built with React and powered by the Google Maps Platform. Whether you're looking for a quick caffeine fix nearby or planning a coffee tour in a new city, CafeCompass helps you find the best spots with ease.

CafeCompass Demo

<img width="1913" height="943" alt="Screenshot 2026-03-20 234305" src="https://github.com/user-attachments/assets/847cf180-8d59-4c88-a05e-a8c0d73d3dc6" />


✨ Features
🔍 Global Search: Find cafes in any city or country using the intuitive search bar with Google Autocomplete.
📍 Nearby Discovery: One-click "Use Current Location" to find the best cafes in your immediate vicinity.
🌙 Dark Mode: Sleek, eye-friendly dark theme for the map and interface, persisted across sessions.
❤️ Favourites: Save your go-to spots to a personalized list for quick access later.
📸 Rich Details: View cafe photos, star ratings, user reviews, opening hours, and direct website links.
📏 Real-time Distance: Automatically calculates how far each cafe is from your current GPS location.
🗺️ Instant Directions: Get turn-by-turn navigation via Google Maps with a single click.

🛠️ Tech Stack
Frontend: React + Vite
Maps: @react-google-maps/api
APIs:
Google Maps JavaScript API
Google Places API (New)
Google Geocoding API
Styling: Vanilla CSS with modern glassmorphism and responsive design.

🚀 Getting Started
Prerequisites
A Google Cloud Project with an API Key.
Enable the following APIs in your Google Console:
Maps JavaScript API
Places API (New)
Geocoding API
Installation
Clone the repository:

bash
git clone https://github.com/Jascinta22/Cafe-Compass.git
cd Cafe-Compass
Install dependencies:

bash
npm install
Set up environment variables: Create a .env file in the root directory and add your API key:

env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
Run the development server:

bash
npm run dev
Open the app: Navigate to http://localhost:5173 in your browser.

🔒 Security
The .env file is included in .gitignore to prevent sensitive API keys from being pushed to public repositories. Always keep your API keys restricted in the Google Cloud Console.

📄 License
This project is open-source and available under the 

MIT License
.

Made with ☕ by Jascinta
