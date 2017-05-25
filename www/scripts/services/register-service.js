//Este é um serviço tamplate
angular.module("starter").factory("registerService", function($http, config) {
    var self = this;


    var _salvar = function(cliente, callBackSuccess, callBackError) {

        $http.post(config.baseUrl + "clientes", cliente)
            .then(
                function(success) {
                    callBackSuccess(success);
                    console.log("Dado persistido!");
                },
                function(error) {
                    callBackError(error);
                    console.log(error);
                });
        return cliente;
    };

    return {
        salvar: _salvar
    };
});