/* eslint-disable radix */
/* eslint-disable prefer-template */
// mapbox.js
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable */

export const displayMap = (locations) => {

// Initialize the map without centering (yet)
const map = L.map('map', {
    scrollWheelZoom: true // Disable scroll zoom by default for better UX
});

// Add a tile layer (the base map)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Define a custom icon
const customIcon = L.icon({
    iconUrl: '/img/pin.png',  // Path to custom marker icon
    iconSize: [30, 40],       // Size of the icon
    iconAnchor: [15, 40],     // Anchor point of the icon
    popupAnchor: [0, -40]     // Position of the popup relative to the icon
});

// Keep track of the current location index
let currentLocationIndex = 0;

// Function to bind popup and open it
function bindAndOpenPopup(marker, content, locIndex) {
    marker.bindPopup(content, { autoClose: false });
    if (locIndex === currentLocationIndex) {
        marker.openPopup();
    }
}

// Add markers with custom icons and popups
const markers = locations.map((loc, index) => {
    const marker = L.marker([loc.coordinates[1], loc.coordinates[0]], { icon: customIcon }).addTo(map);

    const content = `
        <p>${index === 0 ? 'Start Location' : 'Location ' + (index + 1)}</p>
        <button class="next-location" data-index="${index}">Take me to the next location</button>
    `;

    bindAndOpenPopup(marker, content, index);
    return marker;
});

// Set the map's initial view to the first location after adding markers
const startCoordinates = locations[0].coordinates;
map.setView([startCoordinates[1], startCoordinates[0]], 13);

// Fit the map to the markers (optional, you can remove this if you want to keep the initial zoom)
const bounds = L.latLngBounds(locations.map(loc => [loc.coordinates[1], loc.coordinates[0]]));
map.fitBounds(bounds);

// Handle button click to move to the next location
document.addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('next-location')) {
        currentLocationIndex = (parseInt(e.target.dataset.index) + 1) % locations.length;
        const nextLocation = locations[currentLocationIndex];
        map.flyTo([nextLocation.coordinates[1], nextLocation.coordinates[0]], 13);

        // Automatically show the popup for the new location
        const nextMarker = markers[currentLocationIndex];
        nextMarker.openPopup();
    }
});

// Add zoom control buttons
document.getElementById('zoom-in').addEventListener('click', function () {
    map.zoomIn();
});

document.getElementById('zoom-out').addEventListener('click', function () {
    map.zoomOut();
});

// Reset the map to the start location
document.getElementById('reset-map').addEventListener('click', function () {
    currentLocationIndex = 0;
    const startLocation = locations[0];
    map.flyTo([startLocation.coordinates[1], startLocation.coordinates[0]], 13);

    // Open the popup for the start location
    markers[0].openPopup();
});
};
