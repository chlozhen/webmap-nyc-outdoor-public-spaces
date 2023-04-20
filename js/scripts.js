
console.log(myPoints)
console.log(typeof myPoints)

mapboxgl.accessToken = 'pk.eyJ1IjoiY3dob25nIiwiYSI6IjAyYzIwYTJjYTVhMzUxZTVkMzdmYTQ2YzBmMTM0ZDAyIn0.owNd_Qa7Sw2neNJbK6zc1A';

const NYC_COORDINATES = [-73.98795036092295, 40.72391715135848]

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v11', // style URL
    center: NYC_COORDINATES, // starting position [lng, lat]
    zoom: 14, // starting zoom
    bearing: 0,
    pitch: 0
});

map.on('load', function () {

    // add the point source and layer
    // map.addSource('my-points', {
    //     type: 'geojson',
    //     data: myPoints
    // })

    // map.addLayer({
    //     id: 'circle-my-points',
    //     type: 'circle',
    //     source: 'my-points',
    //     paint: {
    //         'circle-color': '#3358ff',
    //         'circle-radius': 8,
    //         'circle-opacity': .6
    //     }
    // })

    // // add the linestring source and layer
    // map.addSource('my-lines', {
    //     type: 'geojson',
    //     data: myLines
    // })

    // map.addLayer({
    //     id: 'line-my-lines',
    //     type: 'line',
    //     source: 'my-lines',
    //     paint: {
    //         'line-width': 4,
    //         'line-color': '#f56289'
    //     },
    //     layout: {
    //         'line-cap': 'round'
    //     }
    // })

    // // add the polygon source and layer
    // map.addSource('my-polygons', {
    //     type: 'geojson',
    //     data: myPolygons
    // })

    // map.addLayer({
    //     id: 'fill-my-polygons',
    //     type: 'fill',
    //     source: 'my-polygons',
    //     paint: {
    //         'fill-color': '#1bc440'
    //     }
    // })

    // // add a line layer that uses the polygon source
    // // demonstrate that two layers can use the same source
    // map.addLayer({
    //     id: 'line-my-polygons',
    //     type: 'line',
    //     source: 'my-polygons',
    //     paint: {
    //         'line-color': '#1b4223',
    //         'line-width': 3,
    //     },
    //     layout: {
    //         'line-cap': 'round'
    //     }
    // })

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

        new mapboxgl.Marker({                    // create new marker
            color: '#875AAF',
            scale: 0.35
        })
            .setLngLat([parseFloat(market.Longitude), parseFloat(market.Latitude)])
            .setPopup(popup)
            .addTo(map)

        // if (hotspot_record.Location_T.includes("Outdoor")) {     // save markers according to location type
        //     outdoor_markers.push(hotspot_marker)
        // }
        // if (hotspot_record.Location_T.includes("Indoor")) {
        //     indoor_markers.push(hotspot_marker)
        // }
        // if (hotspot_record.Location_T == "Subway Station") {
        //     subway_markers.push(hotspot_marker)
        // }
        // if (hotspot_record.Location_T == "Library") {
        //     library_markers.push(hotspot_marker)
        // }

    })

    // Add community garden locations
    map.addSource('nyc-greenthumb', {
        type: 'geojson',
        data: './data/nyc-greenthumb.geojson'
    })

    map.addLayer({
        id: 'fill-nyc-greenthumb',
        type: 'fill',
        source: 'nyc-greenthumb',
        paint: {
            'fill-opacity': 0.8,
            'fill-color': [
                'match',
                ['get', 'status'],
                'Active', '#53C557', //green
                'Active (Unlicensed)', '#53C5B5', //teal
                'Not GreenThumb', '#6D69DE', //blue
                'Closed (Construction)', '#EC8931', //orange
                'Closed (Other)', '#988857', //brown1
                'Inactive (No Group)', '#986A57', //brown2
                'Inactive (Group Forming)', '#83A886', // light green
                /* other */ '#ccc'
            ]

        }
    }, 'road-label-simple')

    // Pop ups for community garden locations
    map.on('click', 'fill-nyc-greenthumb', (e) => {

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


    // demonstrate the layers that are already on the map
    console.log(map.getStyle().layers)

})

