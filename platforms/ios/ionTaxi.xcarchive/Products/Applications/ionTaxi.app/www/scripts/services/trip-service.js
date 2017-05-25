angular.module("starter").factory("TripService", function($ionicPopup, $http, config, corridaService) {
    var self = this;

    //observer motorista encontrado
    self.callbacksDriverFound = [];

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

    var _saveDestinyAdress = function(endereco) {
        self.destinyAdress = endereco;
    }

    var _getDestinyAdress = function() {
        return self.destinyAdress;
    }

    var _saveOriginAdress = function(endereco) {
        self.OriginAdress = endereco;
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

    return {
        saveDestinyAdress: _saveDestinyAdress,
        getDestinyAdress: _getDestinyAdress,
        saveOriginAdress: _saveOriginAdress,
        getOriginAdress: _getOriginAdress,
        requestTrip: _requestTrip,
        addCallbackDriverFound: addCallbackDriverFound,
        executeDriverFound: executeDriverFound
    };
});