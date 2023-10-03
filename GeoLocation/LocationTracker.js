(function() {
    window.onload = init;
    var startButton;
    var map;
    var update = 0;
    var startLatitude;
    var startLongitude;
    var startMarker;
    var marker;
    var polyline;


    function init() {
        startButton = document.getElementById("startButton");
        startButton.onclick = startTrackingLocation;

        var mapOptions = {
            // initial center at (0,0)
            center: { lat: 0, lng: 0 },
            zoom: 15
        };

        // initializes the map when page loads
        map = new google.maps.Map(document.getElementById("map"), mapOptions);

         // creates and adds the first marker
        startMarker = new google.maps.Marker({
            position: { lat: 0, lng: 0 }, 
            map: map
        });

        // sets up google's polyline
        polyline = new google.maps.Polyline({
            path: [],
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 3
        });
        polyline.setMap(map);
    }


    function startTrackingLocation() {
        // disables the start button
        startButton.disabled = true;
        
        var options = {
            enableHighAccuracy: true,
            timeout: 50000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            updateMyLocation,
            handleError,
            options
        );
    }

    function updateMyLocation(position) {
        startLatitude = position.coords.latitude;
        startLongitude = position.coords.longitude;


        // update the starting marker's position
        startMarker.setPosition(new google.maps.LatLng(startLatitude, startLongitude));

        document.getElementById("latitude").innerHTML = 
            "Starting Latitude: " + startLatitude;
        document.getElementById("longitude").innerHTML = 
            "Starting Longitude: " + startLongitude;
        document.getElementById("counter").innerHTML = 
            "Update#: " + update;

        var newLatLng = new google.maps.LatLng(startLatitude, startLongitude);

        // draws the first polyline from starting lat/long to 2nd point
        polyline.getPath().push(newLatLng);

        map.setCenter(newLatLng);

        if (!marker) {
            marker = new google.maps.Marker({
                position: newLatLng,
                map: map
            });
        } else {
            marker.setPosition(newLatLng);
        }

        function birdFlying() {
            var latChange = (Math.random()) / 100;
            var longChange = (Math.random()) / 100;

            startLatitude += latChange;
            startLongitude -= longChange;

            document.getElementById("counter").innerHTML = 
                "Update#: " + ++update;
            document.getElementById("currentLatitude").innerHTML = 
                "Current Latitude: " + startLatitude;
            document.getElementById("currentLongitude").innerHTML = 
                "Current Longitude: " + startLongitude;

            var newLatLng = new google.maps.LatLng(startLatitude, startLongitude);
        
            // Adds the current position to the Polyline's path
            polyline.getPath().push(newLatLng);

            // Update marker position
            marker.setPosition(newLatLng);
        }

        setInterval(birdFlying, 5000);
    }

    // Error messages
    function handleError(error) {
        switch(error.code) {
            case 1:
                updateStatus("The user denied permission");
                break;
            case 2:
                updateStatus("Position is unavailable");
                break;
            case 3:
                updateStatus("Timed out");
                break;
        }
    }

    // Writes error messages if error
    function updateStatus(message) {
        document.getElementById("status").innerHTML = 
            "<strong>Error</strong>: " + message;
    }
})();
