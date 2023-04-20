mapboxgl.accessToken = 'pk.eyJ1IjoiY2hsb3poZW4iLCJhIjoiY2xnNXFlMGkxMDF0YzNobjBzeDZ3dTRodyJ9.aEmIpsNVZeh27U2L1z7j_A';

const NYC_COORDINATES = [-73.98795036092295, 40.72391715135848]
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v11', // style URL
    center: NYC_COORDINATES, // starting position [lng, lat]
    zoom: 13, // starting zoom
    bearing: 0,
    pitch: 0
});

var farmermarketMarkers = []

map.on('load', function () {
    /////////////////////////////////
    // add the point source and layer
    map.addSource('nyc-streetseats', {
        type: 'geojson',
        data: './data/nyc-streetseats-2014-2019.geojson'
    });

    map.addLayer({
        id: 'street seats',
        type: 'circle',
        source: 'nyc-streetseats',
        paint: {
            'circle-color': '#3541E3', //blue
            'circle-radius': 5,
            'circle-opacity': .8
        }
    });

    map.on('click', 'street seats', (e) => {
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setText('street seat')
            .addTo(map);
    });

    /////////////////////////////////
    // add the point source and layer
    map.addSource('nyc-benches', {
        type: 'geojson',
        data: './data/nyc-benches-2022.geojson'
    })

    map.addLayer({
        id: 'benches',
        type: 'circle',
        source: 'nyc-benches',
        paint: {
            'circle-color': '#35C3E3', //light blue
            'circle-radius': 5,
            'circle-opacity': .8
        }
    })

    map.on('click', 'benches', (e) => {
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setText('bench')
            .addTo(map);
    });

    /////////////////////////////////
    // Add nyc park locations
    map.addSource('nyc-parks', {
        type: 'geojson',
        data: './data/nyc-parks.geojson'
    })

    map.addLayer({
        id: 'parks',
        type: 'fill',
        source: 'nyc-parks',
        paint: {
            'fill-opacity': 0.8,
            'fill-color': '#53C557' // green

        }
    }, 'road-label-simple')

    map.on('click', 'parks', (e) => {
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
                    <table class="key-value-table">
                        <tr>
                            <td class="key">Name</td>
                            <td class="value">${e.features[0].properties.name311}</td>
                        </tr>
                        <tr>
                            <td class="key">Location</td>
                            <td class="value">${e.features[0].properties.location}</td>
                        </tr>
                        <tr>
                            <td class="key">Acres</td>
                            <td class="value">${e.features[0].properties.acres}</td>
                        </tr>
                        <tr>
                            <td class="key">Jurisdiction</td>
                            <td class="value">${e.features[0].properties.jurisdiction}</td>
                        </tr>
                    </table>
                    `)
            .addTo(map);
    });

    /////////////////////////////////
    // Add nyc pedestrian plaza locations
    map.addSource('nyc-pedestrianplazas', {
        type: 'geojson',
        data: './data/nyc-pedestrianplazas.geojson'
    })

    map.addLayer({
        id: 'pedestrian plazas',
        type: 'fill',
        source: 'nyc-pedestrianplazas',
        paint: {
            'fill-opacity': 0.8,
            'fill-color': '#DC35E3' //pink

        }
    }, 'road-label-simple')

    map.on('click', 'pedestrian plazas', (e) => {
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
                    <table class="key-value-table">
                        <tr>
                            <td class="key">Name</td>
                            <td class="value">${e.features[0].properties.plazaname}</td>
                        </tr>
                        <tr>
                            <td class="key">Location</td>
                            <td class="value">${e.features[0].properties.onstreet}</td>
                        </tr>
                        <tr>
                            <td class="key">Partner</td>
                            <td class="value">${e.features[0].properties.partner}</td>
                        </tr>
                    </table>
                    `)
            .addTo(map);
    });

    /////////////////////////////////
    // Add community garden locations
    map.addSource('nyc-greenthumb', {
        type: 'geojson',
        data: './data/nyc-greenthumb.geojson'
    })

    map.addLayer({
        id: 'community greenthumb gardens',
        type: 'fill',
        source: 'nyc-greenthumb',
        paint: {
            'fill-opacity': 0.8,
            'fill-color': '#8D35E3' //purple

        }
    }, 'road-label-simple')

    // Pop ups for community garden locations
    map.on('click', 'community greenthumb gardens', (e) => {

        var hours = [[`M : `, e.features[0].properties.openhrsm],
        [`Tu: `, e.features[0].properties.openhrstu],
        [`W : `, e.features[0].properties.openhrsw],
        [`Th: `, e.features[0].properties.openhrsth],
        [`F : `, e.features[0].properties.openhrsf],
        [`Sa: `, e.features[0].properties.openhrssa],
        [`Su: `, e.features[0].properties.openhrssu]]
        var hourshtml = ``
        for (var i = 0; i < hours.length; i++) {
            if (hours[i][1] != null) {
                if (i + 1 < hours.length) {
                    hourshtml += hours[i][0] + hours[i][1] + `</br>`
                }
                else {
                    hourshtml += hours[i][0] + hours[i][1]
                }
            }
        }
        if (hourshtml == ``) {
            hourshtml = `Not available`
        }

        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
                    <table class="key-value-table">
                        <tr>
                            <td class="key">Garden Name</td>
                            <td class="value">${e.features[0].properties.gardenname}</td>
                        </tr>
                        <tr>
                            <td class="key">Park ID</td>
                            <td class="value">${e.features[0].properties.parksid}</td>
                        </tr>
                        <tr>
                            <td class="key">Status</td>
                            <td class="value">${e.features[0].properties.status}</td>
                        </tr>
                        <tr>
                            <td class="key">Hours</td>
                            <td class="value">${hourshtml}</td>
                        </tr>
                        
                    </table>
                    `)
            .addTo(map);
    });

    /////////////////////////////////
    // Add community farmer market locations
    nyc_farmermarketData.forEach(function (market) {
        const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
            <table class="key-value-table">
                <tr>
                <td class="key">Market Name</td>
                <td class="value">${market["Market Name"]}</td>
                </tr>
                <tr>
                <td class="key">Address</td>
                <td class="value">${market["Street Address"]}</td>
                </tr>
                <tr>
                <td class="key">Hours</td>
                <td class="value">${market["Days of Operation"]}: ${market["Hours of Operations"]}</td>
                </tr>
                <tr>
                <td class="key">Open Year-Round</td>
                <td class="value">${market["Open Year-Round"]}</td>
                </tr>
                <tr>
                <td class="key">Season</td>
                <td class="value">${market["Season Dates"]}</td>
                </tr>
            </table>
        `);

        marker = new mapboxgl.Marker({                    // create new marker
            color: '#875AAF',
            scale: 0.5
        })
            .setLngLat([parseFloat(market.Longitude), parseFloat(market.Latitude)])
            .setPopup(popup)
            .addTo(map)

        farmermarketMarkers.push(marker)

    });
});


// Event handling: toggling layers and points
// ref: https://docs.mapbox.com/mapbox-gl-js/example/toggle-layers/
map.on('idle', () => {

    // Enumerate ids of the layers.
    const toggleableLayerIds = ['parks', 'community greenthumb gardens', 'pedestrian plazas', 'street seats', 'benches'];

    // Set up the corresponding toggle button for each layer.
    for (const id of toggleableLayerIds) {
        // Skip layers that already have a button set up.
        if (document.getElementById(id)) {
            continue;
        }

        // Create a link.
        const link = document.createElement('a');
        link.id = id;
        link.href = '#';
        link.textContent = id;
        link.className = 'active';

        // Show or hide layer when the toggle is clicked.
        link.onclick = function (e) {
            const clickedLayer = this.textContent;
            e.preventDefault();
            e.stopPropagation();

            const visibility = map.getLayoutProperty(
                clickedLayer,
                'visibility'
            );

            // Toggle layer visibility by changing the layout object's visibility property.
            if (visibility === 'visible') {
                map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                this.className = '';
            } else {
                this.className = 'active';
                map.setLayoutProperty(
                    clickedLayer,
                    'visibility',
                    'visible'
                );
            }
        };

        const layers = document.getElementById('menu');
        layers.appendChild(link);
    }
});


// Functions for filtering markers
function remove_marker(marker_list) {
    for (var i = 0; i < marker_list.length; i++) {
        marker_list[i].remove()
    }
}
function add_marker(marker_list) {
    for (var i = 0; i < marker_list.length; i++) {
        marker_list[i].addTo(map)
    }
}

function filter_markers(link, id, activeClass, markerlist){
    link.onclick = function (e) {
        console.log(e.textContent)
        var ele = document.getElementById(id)
        console.log(ele.className)
        if (ele.className.includes(activeClass)) {
            ele.className = ""
            remove_marker(markerlist)
        }
        else {
            ele.className = activeClass
            add_marker(markerlist)
        }
    }
}


// Event handling: Toggling Markers
var farmer_id = "farmers market"
const link = document.createElement('a');
link.id = farmer_id;
link.href = '#';
link.textContent = farmer_id;
link.className = 'active';

const layers = document.getElementById('menu');
layers.appendChild(link);

filter_markers(link, farmer_id, link.className, farmermarketMarkers)
