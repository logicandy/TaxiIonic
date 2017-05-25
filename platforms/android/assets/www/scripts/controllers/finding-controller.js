// Finding controller
angular.module('starter').controller('FindingController', function($scope, Drivers, $state, $cordovaGeolocation) {
    var self = this;

    // map height
    $scope.mapHeight = 480;

    // show - hide booking form
    $scope.showForm = false;

    // show - hide modal bg
    $scope.showModalBg = false;

    // get list of drivers
    $scope.drivers = Drivers.all();

    // start on load
    self.init = function() {
        // set up begining position
        var posOptions = { timeout: 10000, enableHighAccuracy: false };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function(position) {
                console.log(position);
                //self.position = position;
                var center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                console.log(document.getElementById('map2'));
                var map = new google.maps.Map(document.getElementById('map2'), {
                    zoom: 16,
                    center: center
                });

                var marker = new google.maps.Marker({
                    position: center,
                    map: map,
                    icon: "img/taxi.gif",
                    optimized: false
                });

                setTimeout(function() {
                    $state.go('driver');
                }, 10000)


            });


        // // get ion-view height
        // var viewHeight = window.screen.height - 44; // minus nav bar
        // // get info block height
        // var infoHeight = document.getElementsByClassName('booking-info')[0].scrollHeight;
        // // get booking form height
        // var bookingHeight = document.getElementsByClassName('booking-form')[0].scrollHeight;
        // // set map height = view height - info block height + booking form height

        // $scope.mapHeight = viewHeight - infoHeight + bookingHeight;
        //$scope.apply();
    }

})