// Dataset: Significant Earthquakes from the past 30 days
// https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson

fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson')
  .then(response => response.json())
  .then(data => {
    const features = data.features;

    // Extract coordinates, calculate bounds
    const coordinates = [];
    features.forEach(feature => {
        const coords = feature.geometry.coordinates;
        coordinates.push([coords[1], coords[0]]);
    });
    const bounds = L.latLngBounds(coordinates);

    // Create map object, tile layer
    const map = L.map('map').fitBounds(bounds);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Color gradient for depth
    function getColor(depth) {
       if (depth < 10) {
           return '#a3f600';
        } else if (depth < 30) {
           return '#dcf400';
        } else if (depth < 50) {
            return '#f7db11';
        } else if (depth < 70) {
            return '#fdb72a';
        } else if (depth > 90) {
            return '#fca35d';
        } else {
           return '#ff5e64';
       }
    };
    
    // Define features to create markers
    features.forEach(feature => {
      const magnitude = feature.properties.mag;
      const place = feature.properties.place;
      const coords = feature.geometry.coordinates;
      const depth = coords[2];
      
      const marker = L.circleMarker([coords[1], coords[0]], {
       radius: magnitude * 4,
       fillColor: getColor(depth),
       color: '#000',
       weight: 1,
       opacity: 1,
       fillOpacity: 0.75
     }).addTo(map);

      // Popup with additional information
      marker.bindPopup(`<h3>QUAKE INFO</h3> Place: ${place}<br> Magnitude: ${magnitude}<br> Depth: ${depth}`);
    });
 });

// Create legend
let legend = L.control({
    position: "bottomright"
});

// Add the legend to the map
legend.addTo(map);