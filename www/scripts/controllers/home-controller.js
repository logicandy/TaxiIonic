angular.module('starter').controller('HomeController', function($scope, $state, $ionicPopup, $timeout, $ionicHistory, $cordovaGeolocation, TripService, $ionicModal, $ionicLoading, PushTokenService, UserService, corridaService, ionicToast) {
    var self = this;
    self.arrayMarkers = [];
    $scope.originAdress = {};
    $scope.destinyAdress = {};
    self.carChoice = "A";
    var geocoder = new google.maps.Geocoder;
    var directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
    var directionsService = new google.maps.DirectionsService();
    self.img1 = "img/coins-1.png";
    self.img2 = "img/coins-gray-2.png";
    // map height
    $scope.mapHeight = 480;

    // show - hide booking form
    $scope.showForm = false;

    // show - hide modal bg
    $scope.showModalBg = false;

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
                var leg = response.routes[0].legs[0];
                self.arrayMarkers[3] = makeMarker(leg.start_location, icons.start, "title");
                self.arrayMarkers[4] = makeMarker(leg.end_location, icons.end, 'title');

            }
        });
    }

    function CenterControl(controlDiv, map) {

        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        //controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = 'none';
        //controlUI.style.borderRadius = '50%';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to recenter the map';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.height = '40px';
        // controlText.style.fontSize = '16px';
        // controlText.style.lineHeight = '38px';
        // controlText.style.paddingLeft = '5px';
        // controlText.style.paddingRight = '5px';
        controlText.innerHTML = '<img src="img/central.png" width="40px;" alt="">';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function() {
            var center = new google.maps.LatLng(self.position.coords.latitude, self.position.coords.longitude);
            map.setCenter(center);
        });

    }

    $scope.rate = function(index) {
        console.log("chegou aqui");
        for (var i = 0; i < $scope.data.stars.length; i++) {
            if (i <= index) {
                $scope.data.stars[i] = 1;
            } else {
                $scope.data.stars[i] = 0;
            }

        }
    }


    $scope.stars = [0, 0, 0, 0, 0];

    var showRating = function(data) {
        console.log("chegou o popup");
        $scope.data = {
            stars: $scope.stars
        }

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            templateUrl: 'templates/popup-rating.html',
            title: 'Obrigado!',
            scope: $scope,
            buttons: [
                { text: 'Cancelar' },
                {
                    text: '<b>Enviar</b>',
                    type: 'button-balanced',
                    onTap: function(e) {
                        if (!$scope.data.stars) {
                            //don't allow the user to close unless he enters note
                            e.preventDefault();
                        } else {
                            return $scope.data.stars;
                        }
                    }
                },
            ]
        });
        myPopup.then(function(res) {
            // save rating here

            // go to home page
            // $ionicHistory.nextViewOptions({
            //     disableBack: true
            // });
            // $state.go('home');
            console.log("YAAAS");
        });
    }

    // toggle form
    $scope.toggleForm = function() {
        $scope.showForm = !$scope.showForm;
        $scope.showModalBg = ($scope.showForm == true);
        resetMap();
        drawRoute();
        makeMarker()
    }

    self.setAdressHome = function() {
        $scope.destinyAdress = $scope.homeAdress;
        console.log($scope.homeAdress);
        var center = new google.maps.LatLng($scope.destinyAdress.latitude, $scope.destinyAdress.longitude);
        console.log(center);
        var marker = new google.maps.Marker({
            position: center,
            map: $scope.map
        });
        TripService.saveDestinyAdress($scope.homeAdress);
        self.arrayMarkers[1] = marker;
        resetMap();
        drawRoute();
    }

    self.setAdressWork = function() {
        $scope.destinyAdress = $scope.workAdress;
        console.log($scope.workAdress);
        var center = new google.maps.LatLng($scope.destinyAdress.latitude, $scope.destinyAdress.longitude);
        console.log(center);
        var marker = new google.maps.Marker({
            position: center,
            map: $scope.map
        });
        TripService.saveDestinyAdress($scope.workAdress)
        self.arrayMarkers[1] = marker;
        resetMap();
        drawRoute();
    }



    var startedTrip = function() {
        directionsDisplay.setMap(null);
        //apaga marcadores
        // for (var marker in self.arrayMarkers) {
        //     marker.setMap(null);
        // }

        for (var i = 0; i < self.arrayMarkers.length; i++) {
            console.log(i);
            if (self.arrayMarkers[i] == null || self.arrayMarkers[i] == undefined) {
                console.log("primeira");
            } else {
                self.arrayMarkers[i].setMap(null);
                console.log("segunda");
            }

        }
        drawRoute();

    }

    var icons = {
        start: new google.maps.MarkerImage(
            // URL
            'img/start.png',
            // (width,height)
            new google.maps.Size(60, 60),
            // The origin point (x,y)
            new google.maps.Point(0, 0),
            // The anchor point (x,y)
            new google.maps.Point(30, 60),
            new google.maps.Size(60, 60),
        ),
        end: new google.maps.MarkerImage(
            // URL
            'img/end.png',
            // (width,height)
            new google.maps.Size(60, 60),
            // The origin point (x,y)
            new google.maps.Point(0, 0),
            // The anchor point (x,y)
            new google.maps.Point(30, 60),
            new google.maps.Size(60, 60),
        ),
        driver: new google.maps.MarkerImage(
            // URL
            'img/taxi-marker.png',
            // (width,height)
            new google.maps.Size(30, 30),
            // The origin point (x,y)
            new google.maps.Point(0, 0),
            // The anchor point (x,y)
            new google.maps.Point(15, 15),
            new google.maps.Size(30, 30),
        )
    };

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


    function makeMarker(position, icon, title) {
        return new google.maps.Marker({
            position: position,
            map: $scope.map,
            icon: icon,
            title: title
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
        var centerControlDiv = document.createElement('div');
        var centerControl = new CenterControl(centerControlDiv, $scope.map);
        centerControlDiv.index = 1;
        $scope.map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(centerControlDiv);

    }

    // code to run each time view is entered
    $scope.$on('$ionicView.enter', function() {
        UserService.getHomeAdress().then(function(doc) {
            console.log(doc);
            $scope.$apply(function() {
                $scope.homeAdress = doc;
            });
        }).catch(function(err) {
            console.log(err);
            $scope.$apply(function() {
                $scope.homeAdress = false;
            });
        });

        UserService.getWorkAdress().then(function(doc) {
            console.log(doc);
            $scope.$apply(function() {
                $scope.workAdress = doc;
            });
        }).catch(function(err) {
            console.log(err);
            $scope.$apply(function() {
                $scope.workAdress = false;
            });
        });

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
        self.posOptions = { timeout: 15000, enableHighAccuracy: false };
        $cordovaGeolocation
            .getCurrentPosition(self.posOptions)
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
                            stylers: [{ color: '#1ea1e8' }]
                        },
                        {
                            featureType: 'water',
                            elementType: 'labels.text.fill',
                            stylers: [{ color: '#1ea1e8' }]
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
                var centerControlDiv = document.createElement('div');
                var centerControl = new CenterControl(centerControlDiv, $scope.map);
                centerControlDiv.index = 1;
                $scope.map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(centerControlDiv);


                $ionicLoading.hide();
                $scope.map.mapTypes.set('styled_map', $scope.styledMapType);
                $scope.map.setMapTypeId('styled_map');


                var icon = new google.maps.MarkerImage(
                    // URL
                    'img/start.png',
                    // (width,height)
                    new google.maps.Size(70, 70),
                    // The origin point (x,y)
                    new google.maps.Point(0, 0),
                    // The anchor point (x,y)
                    new google.maps.Point(35, 70),
                    new google.maps.Size(70, 70),
                );

                var marker = new google.maps.Marker({
                    position: center,
                    map: $scope.map,
                    icon: icon,
                    title: "Hello World!"

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
        TripService.addCallbackStartedTrip(startedTrip);
        TripService.addCallbackEndedTrip(self.reset);
        TripService.addCallbackEndedTrip(showRating);


    };

    $scope.testeCallback = function() {
        TripService.executeDriverFound();
    }

    self.cancelTrip = function() {
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
        });
        var corridaAtiva = corridaService.getCorridaAtiva();
        TripService.cancelTrip(corridaAtiva.id, corridaAtiva).success(function(data) {
            $ionicLoading.hide();
            console.log("cancelou");
            showToast('Corrida cancelada.', 'bottom', 2500);
        }).error(function(erro) {
            $ionicLoading.hide();
            showToast('Não foi cancelar a corrida. Tente novamente.', 'bottom', 2500);
        });
    }

    $scope.teste2 = function() {
        var notif = new Object();
        notif.title = "Teste";
        notif.body = "Vamos lá";
        notif.option = "teste";
        notif.sound = "default";
        PushTokenService.teste2(3, notif);
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
        $scope.message = "Procurando Táxi..."
        setTimeout(function() {
            $scope.$apply(function() {
                $scope.message = "Contatando Táxistas próximos..."
            });
            setTimeout(function() {
                $scope.$apply(function() {
                    $scope.message = "Aguardando resposta..."
                });
            }, 3000)
        }, 3000)

        $scope.showForm = true;
        $scope.closeTermo();
        directionsDisplay.setMap(null);
        for (var i = 0; i < self.arrayMarkers.length; i++) {
            console.log(i);
            if (self.arrayMarkers[i] == null || self.arrayMarkers[i] == undefined) {
                console.log("primeira");
            } else {
                self.arrayMarkers[i].setMap(null);
                console.log("segunda");
            }

        }
        //var center = new google.maps.LatLng($scope.originAdress.latitude, $scope.originAdress.longitude);

        // var image = new google.maps.MarkerImage(
        //     "img/taxi.gif",
        //     new google.maps.Size(50, 50),
        //     new google.maps.Point(0, 0),
        //     new google.maps.Point(25, 25),
        //     new google.maps.Size(50, 50)
        // );

        // var marker = new google.maps.Marker({
        //     position: self.arrayMarkers[0].position,
        //     map: $scope.map,
        //     icon: image,
        //     optimized: false
        // });

        self.arrayMarkers[0].setMap($scope.map);
        $scope.map.setZoom(18);
        $scope.map.setCenter(self.arrayMarkers[0].getPosition());
        $scope.finding = true;
        $scope.showModalBg = true;

        // get ion-view height
        var viewHeight = window.screen.height - 44; // minus nav bar

        //$scope.mapHeight = viewHeight - infoHeight
        //$scope.mapHeight = viewHeight - document.getElementById('find').offsetHeight;

        TripService.saveOriginAdress($scope.originAdress);
        TripService.requestTrip();

        // setTimeout(function() {
        //         foundDriver();
        //     }, 30000)
        // go to finding state
        //$state.go('finding');
        //$state.go('tracking');
    }

    var foundDriver = function(data) {
        console.log(data);

        TripService.getDriver(data.message).success(function(data) {
            $ionicLoading.hide();
            console.log(data);
            $scope.driverInfo = {}
            $scope.driverInfo.placa = data.placaVeiculo;
            $scope.driverInfo.nome = data.nome;
            $scope.driverInfo.modeloVeiculo = data.modeloVeiculo;
            $scope.driverInfo.latitude = data.latitude;
            $scope.driverInfo.longitude = data.longitude;
            $scope.driverInfo.fone = data.fone;
            $scope.showModalBg = false;
            $scope.finding = false;
            $scope.foundDriver = true;
            self.corridaAtiva = true;

            for (var i = 0; i < self.arrayMarkers.length; i++) {
                console.log(i);
                if (self.arrayMarkers[i] == null || self.arrayMarkers[i] == undefined) {
                    console.log("primeira");
                } else {
                    self.arrayMarkers[i].setMap(null);
                    console.log("segunda");
                }

            }

            // self.arrayMarkers[0].setMap(null);
            directionsDisplay.setMap($scope.map);
            var end = self.arrayMarkers[0].position;
            // var end = self.arrayMarkers[1].position;
            var start = new google.maps.LatLng($scope.driverInfo.latitude, $scope.driverInfo.longitude);
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
                    self.arrayMarkers[5] = makeMarker(start, icons.start, "title");
                    self.arrayMarkers[6] = makeMarker(end, icons.driver, 'title');

                }
            });
            showToast('Achamos o motorista.', 'bottom', 2500);
        }).error(function(erro) {
            $ionicLoading.hide();
            showToast('Não achamos o motorista. Tente novamente.', 'bottom', 2500);
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
            console.log(i);
            if (self.arrayMarkers[i] == null || self.arrayMarkers[i] == undefined) {
                console.log("primeira");
            } else {
                self.arrayMarkers[i].setMap(null);
                console.log("segunda");
            }

        }

        $cordovaGeolocation
            .getCurrentPosition(self.posOptions)
            .then(function(position) {
                console.log(position);
                var center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                $scope.map.setCenter(center);

                var icon = new google.maps.MarkerImage(
                    // URL
                    'img/start.png',
                    // (width,height)
                    new google.maps.Size(70, 70),
                    // The origin point (x,y)
                    new google.maps.Point(0, 0),
                    // The anchor point (x,y)
                    new google.maps.Point(35, 70),
                    new google.maps.Size(70, 70),
                );

                var marker = new google.maps.Marker({
                    position: center,
                    map: $scope.map,
                    icon: icon,
                    title: "Hello World!"

                });

                self.arrayMarkers[0] = marker;
                $scope.map.setZoom(18);

            }, function(err) {
                // error
            });
        //adiciona marcador na posição inicial


        //mostra interface correta
        $scope.showModalBg = false;
        $scope.finding = false;
        $scope.foundDriver = false;
        $scope.showForm = false;
        $scope.destinyAdress = {};
        $scope.destinyAdress.formatted_address = 'Escolha seu destino...';
        self.corridaAtiva = false;

    }

    var showToast = function(message, position, time) {
        // ionicToast.show(message, position, stick, time); 
        ionicToast.show(message, position, false, time);
    };

})