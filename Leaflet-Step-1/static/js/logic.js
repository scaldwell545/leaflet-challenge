// Store our API endpoint as queryUrl
// We're pulling all earthquakes from the last seven days
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
});


// Create function to determine color of marker based on depth
function circleColor(depth) {
    if (depth <= 10) {
        return "#ADFF2F";
    } else if (depth <= 30) {
        return "#CEFA05";
    } else if (depth <= 50) {
        return "#FFFF00";
    } else if (depth <= 70) {
        return "#ffd700";
    } else if (depth <= 90) {
        return "#FFA500";
    } else {
        return "#FF0000";
    };
};


// Create function to determine the size of marker based on magnitude
function circleRadius(mag) {
    if (mag <= 1) {
        return 15000;
    } else if (mag <= 2){
        return 30000;
    } else if (mag <= 3){
        return 45000;
    } else if (mag <= 4){
        return 60000;
    } else if (mag <= 5){
        return 75000;
    } else {
        return 100000;
    }
};


// Call function to create our earthquake layer and map
function createFeatures(earthquakeData) {
    
    
    // Pass to leaflet
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
                return new L.circle(location, {
                    color: 'black', // Im not sure why, but this isn't giving the markers an outline.... shouldnt it?
                    radius: circleRadius(feature.properties.mag),
                    fillColor: circleColor(feature.geometry.coordinates[2]),
                    fillOpacity: 0.75,
                    stroke: true,
                    weight: 1
                })
            }
        }
    );

    
    // Send our earthquakes layer to the createMap function
    createMap(earthquakes);
};


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
            40.0902, -95.7129
        ],
        zoom: 4,
        layers: [street, earthquakes]
    });

    
    // Now create a legend and add it to the map
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            depths = [0, 10, 30, 50, 70, 90],
            labels = [];

        
        // loop through our depth intervals and generate a label with a colored square for each interval
        for (var i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + circleColor(depths[i] + 1) + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        };
        return div;
    };
    legend.addTo(myMap);
};
