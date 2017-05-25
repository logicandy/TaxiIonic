angular.module("starter").factory("PushTokenService", function($http, config) {

    var self = this;
    self.token = new Object();

    var _getToken = function(){
        return self.token;
    };

    var _setToken = function(token){
        self.token = token;
    };

    var _salvarToken = function(token) {
        return $http.post(config.baseUrl+ 'usuariotokenpush/cadastrar', token);
    };

    var _deletarToken = function(token) {
        return $http.post(config.baseUrl+ 'usuariotokenpush/deletar', token);
    };

    var _teste2 = function(usuarioid, data) {
        return $http.post(config.baseUrl+ 'usuariotokenpush/notificar/'+usuarioid, data);
    };     

    return {
        salvarToken: _salvarToken,
        teste2: _teste2,
        deletarToken:_deletarToken,
        getToken: _getToken,
        setToken: _setToken
    };
});