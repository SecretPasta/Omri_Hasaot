console.log("Omri Loh");

// Define a variable for Karmiel's coordinates
var karmielCoordinates = [32.919945, 35.290146];

// Starting map point -> karmiel
var map = L.map("map").setView(karmielCoordinates, 13);

// ---> LAYERS OF THE MAP <---

// GOOGLE LAYER
googleStreets = L.tileLayer(
  "http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);

//googleStreets.addTo(map);

//THINDERFOREST LAYER -> USING API KEY
var Thunderforest_Transport = L.tileLayer(
  "https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey={apikey}",
  {
    attribution:
      '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    apikey: "2d481d9d680e404b814d579929fc725b",
    maxZoom: 22,
  }
);

Thunderforest_Transport.addTo(map);

// ---> GEOJSON KARMIEL BUS STOPS ON THE MAP <---

var busStopMarkerOptions = {
  radius: 8,
  fillColor: "#ff7800",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8,
};

fetch("../public/geoJSON/karmielBusStops.geojson")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    // Add the GeoJSON layer to the map once the file is loaded
    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, busStopMarkerOptions);
      },
      onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties["name:en"]) {
          layer.bindPopup(feature.properties["name:en"]);
        }
      },
    }).addTo(map);
  })
  .catch(function (error) {
    console.log(error);
  });

// ---> SEARCH ENGINE JS <---

const defaultIcon = L.icon({
  iconUrl: "../public/img/gps_gray.png", // Specify the path to your default marker icon
  iconSize: [25, 41], // Size of the icon
  iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
});

const hoverIcon = L.icon({
  iconUrl: "../public/img/gps_blue.png", // Specify the path to your hover marker icon
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const searchInputStart = document.getElementById("searchStart");
const searchInputEnd = document.getElementById("searchEnd");
const resultList = document.getElementById("result-list");
const mapContainer = document.getElementById("map");
const currentMarkers = [];

// Unified function to perform search
function performSearch(inputElement) {
  const query = inputElement.value;
  fetch(
    `https://nominatim.openstreetmap.org/search?format=json&polygon=1&addressdetails=1&q=${query}`
  )
    .then((result) => result.json())
    .then((parsedResult) => {
      setResultList(parsedResult);
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
      // Optionally, update the UI to inform the user that an error occurred
    });
}

// Event listener for the start search button
document.getElementById("search-button-start").addEventListener("click", () => {
  performSearch(document.getElementById("searchStart"));
});

// Event listener for the end search button
document.getElementById("search-button-end").addEventListener("click", () => {
  performSearch(document.getElementById("searchEnd"));
});

// function setResultList(parsedResult) {

//   resultList.innerHTML = "";
//   currentMarkers.forEach((marker) => map.removeLayer(marker));
//   currentMarkers.length = 0; // Clear the array after removing markers

//   map.flyTo(new L.LatLng(32.919945, 35.290146), 15);

//   parsedResult.forEach((result) => {
//     const li = document.createElement("li");
//     // Updated TailwindCSS classes for dark theme styling
//     li.className =
//       "rounded-lg mt-2 p-4 shadow hover:bg-gray-700 cursor-pointer bg-gray-800 text-white";
//     // Creating a more user-friendly display format
//     li.innerHTML = `
//             <h5 class="text-lg font-semibold">${result.display_name}</h5>
//             <p class="text-sm text-gray-400">Latitude: ${result.lat}, Longitude: ${result.lon}</p>
//         `;
//     li.addEventListener("click", (event) => {
//       resultList.querySelectorAll("li").forEach((child) => {
//         child.classList.remove("bg-gray-700"); // Remove active class styling
//         child.classList.add("bg-gray-800"); // Reset to default background
//       });
//       event.currentTarget.classList.remove("bg-gray-800");
//       event.currentTarget.classList.add("bg-gray-700"); // Add active class styling
//       const clickedData = { lat: result.lat, lon: result.lon };
//       const position = new L.LatLng(clickedData.lat, clickedData.lon);
//       map.flyTo(position, 18); // Assuming you're using Leaflet for maps
//     });

//     // Assuming you're maintaining a list of currentMarkers and have a Leaflet map instance
//     const position = new L.LatLng(result.lat, result.lon);
//     currentMarkers.push(L.marker(position).addTo(map));
//     resultList.appendChild(li);
//   });
// }

function setResultList(parsedResult) {
  resultList.innerHTML = "";
  // Instead of removing all markers immediately, we'll handle this upon selection
  // currentMarkers.forEach(marker => map.removeLayer(marker));
  // currentMarkers.length = 0;

  parsedResult.forEach((result, index) => {
    const li = document.createElement("li");
    li.className =
      "rounded-lg mt-2 p-4 shadow hover:bg-gray-700 cursor-pointer bg-gray-800 text-white";

    li.innerHTML = `<h5 class="text-lg font-semibold">${result.display_name}</h5>
                        <p class="text-sm text-gray-400">Latitude: ${result.lat}, Longitude: ${result.lon}</p>`;

    const position = new L.LatLng(result.lat, result.lon);
    const marker = L.marker(position, { icon: defaultIcon }).addTo(map);

    // Temporarily store markers in an array to manage them
    currentMarkers.push(marker);

    li.addEventListener("mouseenter", () => {
      marker.setIcon(hoverIcon);
    });
    li.addEventListener("mouseleave", () => {
      marker.setIcon(defaultIcon);
    });

    li.addEventListener("click", () => {
      // Clear all markers except the selected one
      currentMarkers.forEach((m, idx) => {
        if (idx !== index) {
          // Check if it's not the selected marker
          map.removeLayer(m);
        }
      });
      currentMarkers = [marker]; // Keep only the selected marker in the array

      resultList.innerHTML = ""; // Clear the results list
      map.flyTo(position, 18); // Optionally, zoom in on the selected marker
    });

    resultList.appendChild(li);
  });
}
