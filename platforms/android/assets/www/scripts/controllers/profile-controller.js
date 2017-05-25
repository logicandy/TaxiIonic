angular.module("starter").controller('ProfileController', function($scope, $ionicHistory, $state, $ionicModal, $timeout, $ionicLoading, ionicToast, UserService) {
    var self = this;
    $scope.homeAress = {};
    $scope.workAress = {};

    self.update = function() {
        if ($scope.usuario.confirmacaoSenha == $scope.usuario.senha) {
            UserService.updateCliente($scope.usuario.id, $scope.usuario).success(function(data) {
                console.log("atualizou");
                UserService.updateClienteLocal($scope.usuario);
            }).error(function(error) {
                //Mostra notificação na tela...
                console.log("falha carregar cliente");
                showToast('Não foi possível atualizar o perfil. Por favor tente mais tarde.', 'bottom', 2500);
            });
        } else {
            showToast('Não foi possível atualizar o perfil. Senhas não conferem.', 'bottom', 2500);
        }

    }

    self.init = function() {
        $scope.usuario = UserService.getUser().then(function(doc) {
            $scope.$apply(function() {
                $scope.usuario = doc;
                $scope.usuario.confirmacaoSenha = $scope.usuario.senha;
            });
            console.log($scope.usuario);
            if ($scope.usuario == null) {
                $state.go("home");
            }
        });
        UserService.getHomeAdress().then(function(doc) {
            console.log(doc);
            $scope.$apply(function() {
                $scope.homeAress = doc;
            });
        }).catch(function(err) {
            console.log(err);
            $scope.$apply(function() {
                $scope.homeAress.formatted_address = "Não definido";
            });
        });

        UserService.getWorkAdress().then(function(doc) {
            console.log(doc);
            $scope.$apply(function() {
                $scope.workAress = doc;
            });


        }).catch(function(err) {
            console.log(err);
            $scope.$apply(function() {
                $scope.workAress.formatted_address = "Não definido";
            });

        });


    }

    self.init();
    var showToast = function(message, position, time) {
        // ionicToast.show(message, position, stick, time); 
        ionicToast.show(message, position, false, time);
    };
});