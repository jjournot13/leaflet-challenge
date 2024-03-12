// Create map object
let myMap = L.map('map', {
    center: [37.90, -95.71],
    zoom: 5
});

// Add the title layer
let streetMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Assign variable to data source
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Establish colors for earthquake depth
function markerColor(depth) {
    if (depth <= 10) return "#A3F600";
    else if (depth > 30) return "#DCF400";
    else if (depth > 50) return "#F7DB11";
    else if (depth > 70) return "#FDB72A";
    else if (depth > 90) return "#FCA35D";
    else return "#FF5F65";
};

// Determine magnitude for marker size
function markerSize(magnitude) {
    return magnitude * 5;
};

// Retrieve earthquake data and add to map
d3.json(url).then(function(data){
    console.log(data);
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.geometry.coordinates[2]),
                color: "black",
                weight: 0.5,
                opacity: 1,
                fillOpacity: 1
            });
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`<h2>Location: ${feature.properties.place}</h2> <h3>Magnitude: ${feature.properties.mag}</h3>`);
        }
    }).addTo(myMap)

    // Add legend
    let legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
        let div = L.DomUtil.create("div", "legend");
        let depthRanges = [-10, 10, 30, 50, 70, 90];
        let labels = ['<strong>Depth (km)</strong>'];

        // Loop through depth ranges and generate a label with corresponding color
        for (let i = 0; i < depthRanges.length; i++) {
            div.innerHTML +=
                '<i style="background:' + markerColor(depthRanges[i] + 1) + '"></i> ' +
                depthRanges[i] + (depthRanges[i + 1] ? '&ndash;' + depthRanges[i + 1] + '<br>' : '+');
        }

        // Add legend labels to the div
        div.innerHTML = labels.join('<br>') + div.innerHTML;
        return div;
    };

legend.addTo(myMap);
});

