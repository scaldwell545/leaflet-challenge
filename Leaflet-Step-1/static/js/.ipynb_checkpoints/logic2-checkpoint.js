// Store our API endpoint as queryUrl
// We're pulling all earthquakes from the last seven days
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function circleColor(depth) {
    if (depth <= 10) {
        return "#ADFF2F";
    } else if (depth <= 30) {
        return "#9ACD32";
    } else if (depth <= 50) {
        return "#FFFF00";
    } else if (depth <= 70) {
        return "#ffd700";
    } else if (depth <= 90) {
        return "#FFA500";
    } else {
        return "#FF0000";
    }
};

function circleRadius(mag) {
    if (mag <= 1) {
        return 20000;
    } else if (mag <= 2){
        return 30000;
    } else if (mag <= 3){
        return 40000;
    } else if (mag <= 4){
        return 50000;
    } else if (mag <= 5){
        return 60000;
    } else {
        return 70000;
    }
}


function createFeatures(earthquakeData) {
    
    
    var earthquakes = L.geoJSON(earthquakeData, {
        
        onEachFeature: function (feature, layer) {
        // Establich Popup Data
        layer.bindPopup(
        `<h3>${feature.properties.place}</h3><hr><p>
        Date/Time: ${new Date(feature.properties.time)}<br>
        Magnitude: ${feature.properties.mag}<br>
        Depth: ${feature.geometry.coordinates[2]} km</p>`
            )},
        // Associate with circle markers
        pointToLayer: function (feature, location) {
            return new L.circle(location,
                                {radius: circleRadius(feature.properties.mag),
                                 color: 'black',
                                 fillColor: circleColor(feature.geometry.coordinates[2]),
                                 fillOpacity: 0.5,
                                 stroke: false
                                })
        }
    });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}




function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}
