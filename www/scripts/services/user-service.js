//Este é um serviço tamplate
angular.module("starter").factory("UserService", function($http, config) {
    var self = this;
    var db = new DataBase();


    var _getUser = function(cliente, callBackSuccess, callBackError) {
        return db.getDB().get("cliente");
    };

    var _postHomeAdress = function(endereco, callBackSuccess) {
        place = {};
        place.formatted_address = endereco.formatted_address;
        place.address_components = endereco.address_components;
        place.latitude = endereco.latitude;
        place.longitude = endereco.longitude;
        place._id = "homeAdress";

        //db.getDB().put(place);

        db.getDB().get('homeAdress').then(function(doc) {
            place._rev = doc._rev;
            db.put(place);
        }).then(function(response) {
            // handle response
            console.log("atualizou");
            callBackSuccess();
        }).catch(function(err) {
            delete place._id;
            db.create("homeAdress", place);
            console.log(err);
            callBackSuccess();
        });
    };

    var _getHomeAdress = function(cliente, callBackSuccess, callBackError) {
        return db.getDB().get("homeAdress");
    };

    var _postWorkAdress = function(endereco, callBackSuccess) {
        place = {};
        place.formatted_address = endereco.formatted_address;
        place.address_components = endereco.address_components;
        place.latitude = endereco.latitude;
        place.longitude = endereco.longitude;
        place._id = "workAdress";

        //db.getDB().put(place);

        db.getDB().get('workAdress').then(function(doc) {
            place._rev = doc._rev;
            db.put(place);
        }).then(function(response) {
            // handle response
            console.log("atualizou");
            callBackSuccess();
        }).catch(function(err) {
            delete place._id;
            db.create("workAdress", place);
            console.log(err);
            callBackSuccess();
        });
    };

    var _getWorkAdress = function(cliente) {
        return db.getDB().get("workAdress");
    };

    var _updateCliente = function(id, cliente) {
        return $http.post(config.baseUrl + "clientes/" + id, cliente);
    }

    var _updateClienteLocal = function(cliente) {
        db.getDB().get('cliente').then(function(doc) {
            cliente._rev = doc._rev;
            db.put(cliente);
        }).then(function(response) {
            // handle response
            console.log("atualizou");
            callBackSuccess();
        }).catch(function(err) {
            delete cliente._id;
            db.create("cliente", cliente);
            console.log(err);
            //callBackSuccess();
        });
    }




    return {
        getUser: _getUser,
        postHomeAdress: _postHomeAdress,
        getHomeAdress: _getHomeAdress,
        postWorkAdress: _postWorkAdress,
        getWorkAdress: _getWorkAdress,
        updateCliente: _updateCliente,
        updateClienteLocal: _updateClienteLocal
    };
});