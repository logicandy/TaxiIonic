angular.module("starter").factory("loginService", function($http, config) {

    var self = this;
    self.userpushtoken = new Object();

    //Explicando padrão observer para o Marcio
    self.callbacks = [];

    var addCallback = function(callback){
        self.callbacks.push(callback);
    };

    var faz = function(data){
        for(var i;i<self.callback.length;i++){
            self.callback[i](data);
        }
    };

    var _getUserPushToken = function(){
        return self.userpushtoken;
    };

    var _setUserPushToken = function(token){
        self.userpushtoken = token;
    };

    $http.defaults.headers.common['Authorization'] = config.token;

    var _getCliente = function(username, senha) {
        var user = {};
        user.username = username;
        user.senha = senha;
        return $http.post(config.baseUrl + "autenticacao/get", user);
    }

    return {
        getCliente: _getCliente,
        getUserPushToken: _getUserPushToken,
        setUserPushToken: _setUserPushToken
    };
});