angular.module('starter').controller('PlacesController', function($scope, $state, $stateParams, Places, TripService) {
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
                if (!$scope.$$phase) { //Reload page...
                    $scope.$apply();
                }
            } else {
                console.log("falha carregar enderecos");
            }
        });
    };

    self.selectAdress = function(place) {
        if ($stateParams.type == 0) {
            place.latitude = place.geometry.location.lat();
            place.longitude = place.geometry.location.lng();
            TripService.saveDestinyAdress(place);
        } else {
            TripService.saveOriginAdress(place);
        }
        $state.go('home');
    };

});