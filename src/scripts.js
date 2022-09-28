function createMap() {

    mapboxgl.accessToken = _api_key;

    _map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/rzezol/cl8imbt0g002216pietmj8avd',
        center: [19.42050920890234, 51.74833471053924],
        projection: 'globe',
        doubleClickZoom: false
    });

    _map.once('moveend', () => {
        createPlayer(_currentPosition);
        createShelter(_currentPosition);
        generateResources(_currentPosition);
    });

    updateUi();
}

function startLocatingPlayer() {

    navigator.geolocation.watchPosition(
        watchPositionSuccessCallback,
        watchPositionErrorCallback
        );

}

function watchPositionSuccessCallback(position) {

    _currentPosition = position;

    if (_playerMarker === null) {

        firstInit = true;       
        _map.easeTo({
            center: [_currentPosition.coords.longitude, _currentPosition.coords.latitude],
            zoom: 16
        });

        return;

    }

    if (_currentPosition.coords.longitude !== _playerMarker.getLngLat().lng ||
        _currentPosition.coords.latitude !== _playerMarker.getLngLat().lat
    ) {

        _playerMarker.setLngLat([_currentPosition.coords.longitude, _currentPosition.coords.latitude]);
        _map.easeTo({center: [_currentPosition.coords.longitude, _currentPosition.coords.latitude]});
        playerMovedCallback();

    }

}

function watchPositionErrorCallback(err) {

    alert(err.message);

}

function playerMovedCallback() {

    // map.queryRenderedFeatures - to chyba pozwala na wyciągnięcie tylko części znaczników bez iteracji przez wszystkie
    //  użyte z aktualną lokalizacją i odpowiednim zakresem BB powinno zwrócić tylko potencjalne punkty interakcji pomijając resztę (?)

    const maxDistance = 25.0; //meters
    const currentLngLat = new mapboxgl.LngLat(_currentPosition.coords.longitude, _currentPosition.coords.latitude);

    var closestResource = null;
    //find closest resource within given range
    for (var i=0; i<_resourcesArray.length; ++i) {

        let resource = _resourcesArray[i];
        let dist = resource._marker.getLngLat().distanceTo(currentLngLat);
        if (dist > maxDistance)
            continue;

        if (closestResource === null) {
            closestResource = {
                _distance: dist,
                _resource: resource,
                _index: i
            };
        }

        if (closestResource._distance > dist) {
            closestResource = {
                _distance: dist,
                _resource: resource,
                _index: i
            };
        }

    };

    if (closestResource !== null) {

        _shelter.addResource(closestResource._resource);
        closestResource._resource._marker.remove();
        _resourcesArray.splice(closestResource._index, 1);
        updateUi();

    }

}

function updateUi() {
    window.document.getElementById('resources-panel').innerHTML =
        `People: <strong>${_shelter._population}</strong>  Dogs: <strong>${_shelter._dogs}</strong><br>
        Food: <strong>${_shelter._food}</strong>  Wood: <strong>${_shelter._wood}</strong>  Metal: <strong>${_shelter._metal}</strong>`;
}

function createPlayer(position) {

    let htmlMarker = helpers.createMarkerWithIcon(_icons._player);
    _playerMarker = new mapboxgl.Marker(htmlMarker)
                                .setLngLat([position.coords.longitude, position.coords.latitude])
                                .setPopup(new mapboxgl.Popup({maxWidth: 'none', closeButton: false})
                                                      .setHTML("Hey, it's me!"))
                                .addTo(_map);

}

function createShelter(position) {

    let htmlMarker = helpers.createMarkerWithIcon(_icons._shelter, 'rgba(0, 255, 0, 0.5)');
    _shelter._marker = new mapboxgl.Marker(htmlMarker)
                                   .setLngLat([position.coords.longitude, position.coords.latitude + 0.0005])
                                   .setPopup(new mapboxgl.Popup({maxWidth: 'none', closeButton: false})
                                                         .setHTML("This is our shelter.\nThis is home..."))
                                   .addTo(_map);

}

function generateResources(position) {

    let minDist = 0.00125;
    let maxDist = 0.04;
    let count = 25;

    function pickRandomPlace(startRad, endRad) {

        let rad = (Math.random() * (endRad - startRad)) + startRad;
        let dir = new mapboxgl.Point(Math.cos(rad), Math.sin(rad));
        let rnd = Math.random() * maxDist + minDist;
        let vec = new mapboxgl.Point(dir.x * rnd, dir.y * rnd);
        let lng = position.coords.longitude + vec.x;
        let lat = position.coords.latitude + vec.y;
        return {_lng: lng, _lat: lat};

    }

    //TODO https://docs.mapbox.com/mapbox-gl-js/api/geography/#mercatorcoordinate
    //     tutaj da się konwertować latlng na metry - przy pomocy tego można policzyć dokładnie równy promień
    function generator(startRad, endRad) {

        for (i=0; i<count; ++i) {

            //losu losu...
            let resTypeRand = Math.random();
            let resTypeEnum = resTypeRand < 0.25 ? _resourceType._wood : (resTypeRand < 0.50 ? _resourceType._metal : (resTypeRand < 0.75 ? _resourceType._food : _resourceType._people));
            let drawnResIcon = null;
            let drawnResDesc = resTypeEnum;
            let drawnResQuantity = helpers.randomNumberBetween(5, 16);
            switch (resTypeEnum) {
                case _resourceType._wood:
                    drawnResIcon = _icons._wood;
                    break;
                case _resourceType._metal:
                    drawnResIcon = _icons._metal;
                    break;
                case _resourceType._food:
                    drawnResIcon = _icons._food;
                    break;
                case _resourceType._people:
                    drawnResIcon = _icons._people;
                    break;
            };
            
            let randomPlace = pickRandomPlace(startRad, endRad);
            let htmlMarker = helpers.createMarkerWithIcon(drawnResIcon);
            const marker = new mapboxgl.Marker(htmlMarker)
                        .setLngLat([randomPlace._lng, randomPlace._lat])
                        .setPopup(new mapboxgl.Popup({maxWidth: 'none', closeButton: false})
                                              .setHTML(`Resource: <b>${drawnResDesc}</b><br>Quantity: <b>${drawnResQuantity}</b>`))
                        .addTo(_map);

            _resourcesArray.push({
                _marker: marker,
                _type: resTypeEnum,
                _quantity: drawnResQuantity
            });

        }

    }

    generator(0, 0.5*Math.PI);
    generator(0.5*Math.PI, Math.PI);
    generator(Math.PI, 1.5*Math.PI);
    generator(1.5*Math.PI, 2*Math.PI);


    //dog :)
    let dogRandomPlace = pickRandomPlace(0.01, 2*Math.PI);
    let dogRandomQuantity = helpers.randomNumberBetween(1, 4);
    let htmlMarker = helpers.createMarkerWithIcon(_icons._dog);
    const marker = new mapboxgl.Marker(htmlMarker)
                .setLngLat([dogRandomPlace._lng, dogRandomPlace._lat])
                .setPopup(new mapboxgl.Popup({maxWidth: 'none', closeButton: false})
                                      .setHTML(`Resource: <b>${_resourceType._dog}</b><br>Quantity: <b>${dogRandomQuantity}</b>`))
                .addTo(_map);
    _resourcesArray.push({
        _marker: marker,
        _type: _resourceType._dog,
        _quantity: dogRandomQuantity
    });

}
