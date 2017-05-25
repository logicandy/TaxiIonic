//Este é um serviço tamplate
angular.module("starter").factory("senhaService", function($http, config) {
    var self = this;


    $http.defaults.headers.common['Authorization'] = config.token;

    var _getCliente = function(email, callBackSuccess, callBackError) {
        $http.get(config.baseUrl + "clientes/byemail/" + email)
            .success(function(data) {
                callBackSuccess(data);
            }).error(function(error) {
                callBackError(error);
            });
    };

    var _enviarEmailRecuperacao = function(email) {
        return $http.get(config.baseUrl + "senha/" + email);
    };


    return {
        getCliente: _getCliente,
        enviarEmailRecuperacao: _enviarEmailRecuperacao
    };
});