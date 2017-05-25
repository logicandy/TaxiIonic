angular.module("starter").controller('senhaController', function($scope, $ionicHistory, $state, $ionicLoading, senhaService, ionicToast) {
    var self = this;

    self.email = "";
    self.cliente = {};

    self.carregaCliente = function() {
        $ionicLoading.show();
        senhaService.getCliente(self.email,
            function(data) {
                self.cliente = data;
                if (self.cliente.email != undefined && self.cliente.email != "") {
                    enviarEmailRecuperacao();
                } else {
                    $ionicLoading.hide();
                    showToast('Email não cadastrado no sistema.', 'bottom', 2500);
                }
            },
            function(error) {
                $ionicLoading.hide();
                showToast('Email não cadastrado no sistema.', 'bottom', 2500);
            }
        );
    };

    self.enviarEmailRecuperacao = function() {
        $ionicLoading.show();

        senhaService.enviarEmailRecuperacao(self.email).success(function(data) {
            $ionicLoading.hide();
            showToast('Email enviado com sucesso.', 'bottom', 2500);
        }).error(function(erro) {
            $ionicLoading.hide();
            showToast('Ocorreu um erro, por favor tente mais tarde.', 'bottom', 2500);
        });
    };

    var showToast = function(message, position, time) {
        ionicToast.show(message, position, false, time);
    };

});