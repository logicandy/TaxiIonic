angular.module("starter").factory("TripService", function($ionicPopup, $http, config, corridaService) {
    var self = this;

    //observer motorista encontrado
    self.callbacksDriverFound = [];
    self.callbacksStartedTrip = [];
    self.callbacksEndedTrip = [];

    var addCallbackDriverFound = function(callback) {
        console.log("added");
        self.callbacksDriverFound.push(callback);
    };

    var executeDriverFound = function(data) {
        console.log("chamou");
        console.log(self.callbacksDriverFound);
        for (var i = 0; i < self.callbacksDriverFound.length; i++) {
            self.callbacksDriverFound[i](data);
        }
    };

    var addCallbackStartedTrip = function(callback) {
        console.log("added");
        self.callbacksStartedTrip.push(callback);
    };

    var executeStartedTrip = function(data) {
        console.log("chamou");
        console.log(self.callbacksStartedTrip);
        for (var i = 0; i < self.callbacksStartedTrip.length; i++) {
            self.callbacksStartedTrip[i](data);
        }
    };

    var addCallbackEndedTrip = function(callback) {
        console.log("added");
        self.callbacksEndedTrip.push(callback);
    };

    var executeEndedTrip = function(data) {
        console.log("chamou");
        console.log(self.callbacksEndedTrip);
        for (var i = 0; i < self.callbacksEndedTrip.length; i++) {
            self.callbacksEndedTrip[i](data);
        }
    };

    var _saveDestinyAdress = function(endereco) {
        self.destinyAdress = endereco;
    }

    var _getDestinyAdress = function() {
        return self.destinyAdress;
    }

    var _saveOriginAdress = function(endereco) {
        self.OriginAdress = endereco;
    }

    var _getMotorista = function() {
        return $http.get(config.baseUrl + "pessoa");
    }

    var _cancelTrip = function(id, corrida) {
        return $http.put(config.baseUrl + "corridas/cancela/" + id, corrida);
    }

    var _getOriginAdress = function() {
        return self.OriginAdress;
    }

    var _requestTrip = function() {
        var enderecoOrigem = {};
        enderecoOrigem.enderecoFormatado = self.OriginAdress.formatted_address;
        enderecoOrigem.endereco = self.OriginAdress.formatted_address;
        enderecoOrigem.latitude = self.OriginAdress.latitude;
        enderecoOrigem.longitude = self.OriginAdress.longitude;
        enderecoOrigem.componentes = self.OriginAdress.address_components;
        enderecoOrigem.ordem = 0;
        enderecoOrigem.origem = true;

        corridaService.addCorridaEndereco(enderecoOrigem);
        console.log(enderecoOrigem);

        var enderecoDestino = {};
        enderecoDestino.enderecoFormatado = self.destinyAdress.formatted_address;
        enderecoDestino.endereco = self.destinyAdress.formatted_address;
        enderecoDestino.latitude = self.destinyAdress.latitude;
        enderecoDestino.longitude = self.destinyAdress.longitude;
        enderecoDestino.componentes = self.destinyAdress.address_components;
        enderecoDestino.ordem = 1;
        enderecoDestino.origem = false;
        corridaService.addCorridaEndereco(enderecoDestino);
        console.log(enderecoDestino);


        corridaService.salvar();
    }

    var _getDriver = function(id) {
        return $http.get(config.baseUrl + "motoristas/" + id);
    };


    return {
        saveDestinyAdress: _saveDestinyAdress,
        getDestinyAdress: _getDestinyAdress,
        saveOriginAdress: _saveOriginAdress,
        getOriginAdress: _getOriginAdress,
        requestTrip: _requestTrip,
        addCallbackDriverFound: addCallbackDriverFound,
        executeDriverFound: executeDriverFound,
        addCallbackStartedTrip: addCallbackStartedTrip,
        executeStartedTrip: executeStartedTrip,
        addCallbackEndedTrip: addCallbackEndedTrip,
        executeEndedTrip: executeEndedTrip,
        cancelTrip: _cancelTrip,
        getDriver: _getDriver
    };
});