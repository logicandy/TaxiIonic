angular.module("starter").controller('registerController', function($scope, $ionicHistory, $state, $ionicModal, $timeout, $ionicLoading, registerService, ionicToast) {
    var self = this;

    self.nome = "";
    self.email = "";
    self.telefoneSM = "";
    self.telefone = "";
    self.senha = "";
    self.confirmacao = "";


    self.montaTelefoneComMascara = function() {
        var telefone = self.telefoneSM;
        if (self.telefoneSM.length == 11) {
            var res = "(";
            res = res + telefone[0] + telefone[1] + ") ";
            res = res + telefone.substring(2, 7) + "-";
            res = res + telefone.substring(7, 11);
            self.telefone = res;
        }
    };

    self.registrarCliente = function() {
        if (self.email != undefined && self.email != "" &&
            self.telefoneSM != undefined && self.telefoneSM != "" &&
            self.senha != undefined && self.senha != "") {
            if (self.senha == self.confirmacao) {
                var cliente = new Object();
                cliente.nome = self.nome;
                cliente.email = self.email;
                cliente.senha = self.senha;
                cliente.inatino = 0;
                cliente.tipo = "APP";
                cliente.inativo = false;

                self.montaTelefoneComMascara();
                cliente.telefone = self.telefone;

                cliente.telefonesFavoritos = [];

                var telefonesF = new Object();
                telefonesF.fone = self.telefone;
                cliente.telefonesFavoritos.push(telefonesF);

                $ionicLoading.show();

                registerService.salvar(cliente,
                    function(data) {
                        $ionicLoading.hide();
                        $state.go('login');
                        clear();
                        showToast('Usuário cadastrado com sucesso.', 'bottom', 2500);

                    },
                    function(error) {
                        $ionicLoading.hide();
                        console.log(error);
                        console.log("erro ao salvar usuário");
                        showToast('Não foi possível registrar seu usuário. Por favor tente mais tarde.', 'bottom', 2500);
                    });
            } else {
                showToast('As senhas digitadas não conferem.', 'bottom', 2500);
            }
        } else {
            showToast('Não foi possível registrar seu usuário. Por favor preencha todos os campos obrigatórios.', 'bottom', 2500);
        }

    };

    //showToast('Não foi possível registrar seu usuário. Por favor preencha todos os campos obrigatórios.', 'bottom', 2500);
    var showToast = function(message, position, time) {
        // ionicToast.show(message, position, stick, time); 
        ionicToast.show(message, position, false, time);
    };

    function clear() {
        self.nome = "";
        self.email = "";
        self.telefoneSM = "";
        self.senha = "";
        self.confirmacao = "";
    }

    $scope.showNumber = function(params) {
        console.log(self.telefoneSM);
    }

});