angular.module('starter').controller('HomeController', function($scope, $state, $ionicPopup, $timeout, $ionicHistory, $cordovaGeolocation, TripService, $ionicModal, $ionicLoading, PushTokenService) {
    var self = this;
    self.arrayMarkers = [];
    $scope.originAdress = {};
    $scope.destinyAdress = {};
    self.carChoice = "A";
    var geocoder = new google.maps.Geocoder;
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();
    self.img1 = "img/coins-1.png";
    self.img2 = "img/coins-gray-2.png";
    // map height
    $scope.mapHeight = 480;

    // show - hide booking form
    $scope.showForm = false;

    // show - hide modal bg
    $scope.showModalBg = false;

    // toggle form
    $scope.toggleForm = function() {
        $scope.showForm = !$scope.showForm;
        $scope.showModalBg = ($scope.showForm == true);
    }

    // list vehicles
    $scope.vehicles = [{
            name: 'Taxi',
            icon: 'icon-taxi',
            active: true
        },
        {
            name: 'SUV',
            icon: 'icon-car',
            active: false
        },
        {
            name: 'Car',
            icon: 'icon-sedan',
            active: false
        }
    ]

    // Note to driver
    $scope.note = '';

    // Promo code
    $scope.promo = '';

    // toggle active vehicle
    $scope.toggleVehicle = function(index) {
        for (var i = 0; i < $scope.vehicles.length; i++) {
            $scope.vehicles[i].active = (i == index);
        }
    }

    function drawRoute() {
        self.arrayMarkers[0].setMap(null);
        directionsDisplay.setMap($scope.map);
        var start = self.arrayMarkers[0].position;
        var end = self.arrayMarkers[1].position;
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        };
        console.log(request, "request");
        directionsService.route(request, function(response, status) {
            console.log(status, "status");
            if (status == google.maps.DirectionsStatus.OK) {
                console.log("chegou aqui");
                directionsDisplay.setDirections(response);
            }
        });
    }

    function resetMap() {
        var center = new google.maps.LatLng($scope.originAdress.latitude, $scope.originAdress.longitude);
        var mapOptions = {
            zoom: 14,
            center: center,
            zoomControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false
        }

        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
        $scope.map.mapTypes.set('styled_map', $scope.styledMapType);
        $scope.map.setMapTypeId('styled_map');
    }

    // code to run each time view is entered
    $scope.$on('$ionicView.enter', function() {
        //Verifica endereço de destino
        if (TripService.getDestinyAdress() != undefined) {
            $scope.destinyAdress = TripService.getDestinyAdress();
            console.log($scope.destinyAdress);
            var destiny = new google.maps.LatLng($scope.destinyAdress.latitude, $scope.destinyAdress.longitude);
            console.log($scope.map);
            var marker = new google.maps.Marker({
                position: destiny,
                map: $scope.map,

            });
            self.arrayMarkers[1] = marker;
            resetMap();
            drawRoute();

        } else {
            $scope.destinyAdress.formatted_address = "Escolha seu destino...";

        }

        //Verifica endereço de origem
        if (TripService.getOriginAdress() != undefined) {
            $scope.originAdress = TripService.getOriginAdress();
            $scope.originAdress.latitude = $scope.originAdress.geometry.location.lat();
            $scope.originAdress.longitude = $scope.originAdress.geometry.location.lng();
            var center = new google.maps.LatLng($scope.originAdress.latitude, $scope.originAdress.longitude);
            console.log(center);
            $scope.origin = center;
            resetMap();
            var marker = new google.maps.Marker({
                position: center,
                map: $scope.map
            });

            self.arrayMarkers[0] = marker;

            if (self.arrayMarkers.length > 1) {
                drawRoute();
            }

        } else {
            //$scope.originAdress.formatted_address = "Escolha seu destino...";

        }
        console.log(self.arrayMarkers);
    });

    function initialize() {
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
        });
        // set up begining position
        console.log("inicializou");
        var posOptions = { timeout: 15000, enableHighAccuracy: false };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function(position) {
                console.log(position);
                self.position = position;
                var center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                $scope.styledMapType = new google.maps.StyledMapType(
                    [
                        { elementType: 'geometry', stylers: [{ color: '#ebe3cd' }] },
                        { elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
                        { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
                        {
                            featureType: 'administrative',
                            elementType: 'geometry.stroke',
                            stylers: [{ color: '#c9b2a6' }]
                        },
                        {
                            featureType: 'administrative.land_parcel',
                            elementType: 'geometry.stroke',
                            stylers: [{ color: '#dcd2be' }]
                        },
                        {
                            featureType: 'administrative.land_parcel',
                            elementType: 'labels.text.fill',
                            stylers: [{ color: '#ae9e90' }]
                        },
                        {
                            featureType: 'landscape.natural',
                            elementType: 'geometry',
                            stylers: [{ color: '#dfd2ae' }]
                        },
                        {
                            featureType: 'poi',
                            elementType: 'geometry',
                            stylers: [{ color: '#dfd2ae' }]
                        },
                        {
                            featureType: 'poi',
                            elementType: 'labels.text.fill',
                            stylers: [{ color: '#93817c' }]
                        },
                        {
                            featureType: 'poi.park',
                            elementType: 'geometry.fill',
                            stylers: [{ color: '#a5b076' }]
                        },
                        {
                            featureType: 'poi.park',
                            elementType: 'labels.text.fill',
                            stylers: [{ color: '#447530' }]
                        },
                        {
                            featureType: 'road',
                            elementType: 'geometry',
                            stylers: [{ color: '#f5f1e6' }]
                        },
                        {
                            featureType: 'road.arterial',
                            elementType: 'geometry',
                            stylers: [{ color: '#fdfcf8' }]
                        },
                        {
                            featureType: 'road.highway',
                            elementType: 'geometry',
                            stylers: [{ color: '#f8c967' }]
                        },
                        {
                            featureType: 'road.highway',
                            elementType: 'geometry.stroke',
                            stylers: [{ color: '#e9bc62' }]
                        },
                        {
                            featureType: 'road.highway.controlled_access',
                            elementType: 'geometry',
                            stylers: [{ color: '#e98d58' }]
                        },
                        {
                            featureType: 'road.highway.controlled_access',
                            elementType: 'geometry.stroke',
                            stylers: [{ color: '#db8555' }]
                        },
                        {
                            featureType: 'road.local',
                            elementType: 'labels.text.fill',
                            stylers: [{ color: '#806b63' }]
                        },
                        {
                            featureType: 'transit.line',
                            elementType: 'geometry',
                            stylers: [{ color: '#dfd2ae' }]
                        },
                        {
                            featureType: 'transit.line',
                            elementType: 'labels.text.fill',
                            stylers: [{ color: '#8f7d77' }]
                        },
                        {
                            featureType: 'transit.line',
                            elementType: 'labels.text.stroke',
                            stylers: [{ color: '#ebe3cd' }]
                        },
                        {
                            featureType: 'transit.station',
                            elementType: 'geometry',
                            stylers: [{ color: '#dfd2ae' }]
                        },
                        {
                            featureType: 'water',
                            elementType: 'geometry.fill',
                            stylers: [{ color: '#b9d3c2' }]
                        },
                        {
                            featureType: 'water',
                            elementType: 'labels.text.fill',
                            stylers: [{ color: '#92998d' }]
                        }
                    ], { name: 'Styled Map' });

                var mapOptions = {
                    zoom: 17,
                    center: center,
                    zoomControl: false,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,

                }

                $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
                $ionicLoading.hide();
                $scope.map.mapTypes.set('styled_map', $scope.styledMapType);
                $scope.map.setMapTypeId('styled_map');

                var marker = new google.maps.Marker({
                    position: center,
                    map: $scope.map,

                });

                //addYourLocationButton($scope.map, marker);

                //array com posição inicial e final
                self.arrayMarkers[0] = marker;

                geocoder.geocode({ 'location': center }, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        if (results.length > 0) {
                            var result = results[0]; //Pega o primeiro endereço data.resultsor default.
                            console.log("Dados de endereco: ")
                            console.log(result);
                            $scope.$apply(function() {
                                $scope.originAdress = results[0];
                                $scope.originAdress.latitude = position.coords.latitude;
                                $scope.originAdress.longitude = position.coords.longitude;
                            });

                        }
                    } else {
                        console.log("falha carregar endereco");
                    }
                });


            }, function(err) {
                console.log(err);
                return initialize();

            });


        // get ion-view height
        var viewHeight = window.screen.height; // minus nav bar
        // get info block height
        $scope.infoHeight = document.getElementsByClassName('booking-info')[0].offsetHeight;
        console.log("Aqui a altura");
        // get booking form height
        //var bookingHeight = document.getElementsByClassName('booking-form')[0].scrollHeight;
        // set map height = view height - info block height + booking form height
        // $scope.mapHeight = viewHeight - $scope.infoHeight;
        $scope.mapHeight = viewHeight;
        $scope.infoHeightHalf = $scope.infoHeight - document.getElementsByClassName('loader')[0].offsetHeight;
        console.log($scope.mapHeight);
        // $scope.mapHeight = viewHeight - infoHeight + bookingHeight;
        //$scope.apply();

    }
    // load map when the ui is loaded
    $scope.init = function() {
        initialize();
        TripService.addCallbackDriverFound(foundDriver);

    };

    $scope.testeCallback = function() {
        TripService.executeDriverFound();
    }

    $scope.teste2 = function() {
        var notif = new Object();
        notif.title = "Teste";
        notif.body = "Vamos lá";
        notif.option = "teste";
        notif.sound = "default";
        PushTokenService.teste2(2, notif);
    };

    // Show note popup when click to 'Notes to driver'
    $scope.showNotePopup = function() {
        $scope.data = {}

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            templateUrl: 'templates/popup-note.html',
            title: 'Notes to driver',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Save</b>',
                    type: 'button-balanced',
                    onTap: function(e) {
                        if (!$scope.data.note) {
                            //don't allow the user to close unless he enters note
                            e.preventDefault();
                        } else {
                            return $scope.data.note;
                        }
                    }
                },
            ]
        });
        myPopup.then(function(res) {
            $scope.note = res;
        });
    };

    // Show promote code popup when click to 'Promote Code'
    $scope.showPromoPopup = function() {
        $scope.data = {}

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            templateUrl: 'templates/popup-promo.html',
            title: 'Promo code',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Save</b>',
                    type: 'button-balanced',
                    onTap: function(e) {
                        if (!$scope.data.promo) {
                            //don't allow the user to close unless he enters note
                            e.preventDefault();
                        } else {
                            return $scope.data.promo;
                        }
                    }
                },
            ]
        });
        myPopup.then(function(res) {
            $scope.promo = res;
        });
    };

    // go to next view when the 'Book' button is clicked
    $scope.book = function() {
        // hide booking form
        //$scope.toggleForm();
        $scope.showForm = true;
        $scope.closeTermo();
        directionsDisplay.setMap(null);
        //var center = new google.maps.LatLng($scope.originAdress.latitude, $scope.originAdress.longitude);

        var image = new google.maps.MarkerImage(
            "img/taxi.gif",
            new google.maps.Size(50, 50),
            new google.maps.Point(0, 0),
            new google.maps.Point(25, 25),
            new google.maps.Size(50, 50)
        );

        var marker = new google.maps.Marker({
            position: self.arrayMarkers[0].position,
            map: $scope.map,
            icon: image,
            optimized: false
        });

        self.arrayMarkers[2] = marker;
        $scope.map.setZoom(18);
        $scope.map.setCenter(marker.getPosition());
        $scope.finding = true;

        // get ion-view height
        var viewHeight = window.screen.height - 44; // minus nav bar

        //$scope.mapHeight = viewHeight - infoHeight
        //$scope.mapHeight = viewHeight - document.getElementById('find').offsetHeight;

        TripService.saveOriginAdress($scope.originAdress);
        TripService.requestTrip();

        setTimeout(function() {
                foundDriver();
            }, 2000)
            // go to finding state
            //$state.go('finding');
            //$state.go('tracking');
    }

    var foundDriver = function(data) {
        console.log("chegou aqui");
        $scope.$apply(function() {
            $scope.finding = false;
            $scope.foundDriver = true;
            self.corridaAtiva = true;
        });

    }

    $ionicModal.fromTemplateUrl('templates/modal-options.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modalOptions = modal;
    });
    $scope.openTermo = function() {
        $scope.modalOptions.show();
    };
    $scope.closeTermo = function() {
        $scope.modalOptions.hide();
    };

    self.changeTaxi = function() {
        if (self.carChoice == 'A') {
            self.img1 = "img/coins-1.png";
            self.img2 = "img/coins-gray-2.png";
        } else {
            self.img1 = "img/coins-gray-1.png";
            self.img2 = "img/coins-2.png";
        }
    }

    self.reset = function() {
        //apaga rotas
        directionsDisplay.setMap(null);
        //apaga marcadores
        // for (var marker in self.arrayMarkers) {
        //     marker.setMap(null);
        // }

        for (var i = 0; i < self.arrayMarkers.length; i++) {
            self.arrayMarkers[i].setMap(null);

        }
        //adiciona marcador na posição inicial
        self.arrayMarkers[0].setMap($scope.map);
        $scope.map.setCenter(self.arrayMarkers[0].getPosition());
        $scope.map.setZoom(18);

        //mostra interface correta
        $scope.finding = false;
        $scope.foundDriver = false;
        $scope.showForm = false;
        $scope.destinyAdress = {};
        $scope.destinyAdress.formatted_address = 'Escolha seu destino...';
        self.corridaAtiva = false;

    }
})