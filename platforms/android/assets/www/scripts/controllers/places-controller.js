angular.module('starter').controller('PlacesController', function($scope, $state, $stateParams, Places, TripService, UserService) {
    // set list places
    var self = this;
    var geocoder = new google.maps.Geocoder();

    $scope.places = Places.all();

    // list recent places
    $scope.recentPlaces = Places.recent();

    self.procuraEndereco = function() {
        geocoder.geocode({ 'address': self.endereco.enderecoFormatado }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                $scope.resultAdress = results;
                // if (!$scope.$$phase) { //Reload page...
                //     $scope.$apply();
                // }
            } else {
                console.log("falha carregar enderecos");
            }
        });
    };

    self.selectAdress = function(place) {
        switch ($stateParams.type) {
            case 0:
                place.latitude = place.geometry.location.lat();
                place.longitude = place.geometry.location.lng();
                TripService.saveDestinyAdress(place);
                $state.go('home');
                break;

            case 1:
                TripService.saveOriginAdress(place);
                $state.go('home');
                break

            case 2:
                place.latitude = place.geometry.location.lat();
                place.longitude = place.geometry.location.lng();
                UserService.postHomeAdress(place, goProfile);

                break;

            case 3:
                place.latitude = place.geometry.location.lat();
                place.longitude = place.geometry.location.lng();
                UserService.postWorkAdress(place, goProfile);
                break;

            default:
                break;
        }
    };

    function push(array, place) {
        for (var i = 0; i < array.length; i++) {
            if (i + 1 == array.length) {
                array[i] = place
            } else {
                array[i] = array[i + 1];
            }
        }
    }

    var goProfile = function(params) {
        $state.go('profile');
    }

});