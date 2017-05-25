angular.module("starter").controller('loginController', function($scope, $ionicHistory, $state, $ionicModal, $timeout, $ionicLoading, loginService, PushTokenService) {
    var self = this;

    self.usuario = "";
    self.senha = "";
    var db = new DataBase();
    self.adivertencia = false;

    // Authentication controller
    // Put your login, register functions here
    // $scope.fbLogin = function() {
    //     ngFB.login({ scope: 'email,read_stream,publish_actions' }).then(
    //         function(response) {
    //             if (response.status === 'connected') {
    //                 console.log('Facebook login succeeded');
    //                 self.loginComum();
    //             } else {
    //                 alert('Facebook login failed');
    //             }
    //         });
    // };

    self.changeTeste = function() {
        console.log(self.usuario);
    };

    self.makeLogout = function() {
        var db = new DataBase();
        db.getDB().get("cliente").then(function(doc) {

            db.getDB().get("usuariotoken", function callback(err, result) {
              //Não tem a token
            }).then(function (doc) {
              console.log(doc);

              var pushtoken = new Object();
              pushtoken.token = doc.token;
              pushtoken.plataforma = doc.plataforma;
              
              PushTokenService.deletarToken(pushtoken).success(function(data) {
                      
              }).error(function(erro) {

              });

            });

            db.getDB().remove(doc, function callback(err, result) {
                if (!err) {
                    console.log('Successfully remove a data');
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });

                    $state.go('login');
                }
            });
        });
    };

    var verificaLogin = function() {


        /*networkinterface.getIPAddress(function (ip) { 
            console.log(ip); 
        });*/

        //db.delete("cliente");
        db.getDB().get("cliente", function callback(err, result) {
            if (result == undefined) {
                //Não faz nada
            }
        }).then(function(doc) {
            console.log(doc);
            nextPage();
        });
    };

    self.changeSenhaLogin = function() {
        self.adivertencia = false;
    };

    self.loginComum = function() {
        $ionicLoading.show();
        loginService.getCliente(self.usuario, self.senha).success(function(data) {
            $ionicLoading.hide();
            console.log("sucesso carregar cliente");
            console.log(data);
            if (data) {
                var usr = {};
                usr.id = data.id;
                usr.nome = data.nome;
                usr.username = data.username;
                usr.senha = data.senha;
                usr.idFacebook = "";
                usr.emailFacebook = "";
                usr.empresa = data.empresa;
                usr.tipo = data.tipo;
                usr.telefone = data.telefone;
                if (data.empresaJson) {
                    usr.utilizaVoucher = data.empresaJson.utilizaVoucher;
                    usr.utilizaEticket = data.empresaJson.utilizaEticket;
                } else {
                    usr.utilizaVoucher = false;
                    usr.utilizaEticket = false;
                }
                db.create("cliente", usr);
                //Salvar token push aqui
                self.idcliente = data.id;
                db.getDB().get("usuariopushtoken", function callback(err, result) {
                    if (result == undefined) {
                        //Não faz nada
                    }
                }).then(function(doc) {
                    var usuarioToken = new Object();
                    usuarioToken.token = doc.token;
                    usuarioToken.plataforma = doc.plataforma;
                    usuarioToken.cliente = new Object();
                    usuarioToken.cliente.id = self.idcliente;
                    PushTokenService.salvarToken(usuarioToken).success(function(data) {
                        console.log("Sucesso ao enviar usuariopushtoken");
                    }).error(function(erro) {
                        console.log("Erro ao enviar usuariopushtoken");
                    });
                });
                nextPage();
            } else {
                //Mostra notificação na tela...
                self.adivertencia = true;
                console.log("Não veio nada...");
            }

        }).error(function(error) {
            $ionicLoading.hide();
            //Mostra notificação na tela...
            self.adivertencia = true;
            console.log("falha carregar cliente");
        });
    };

    var nextPage = function() {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });

        $state.go('home');
    };

    self.makeLogout();
    //verificaLogin();
    //nextPage();

    /*var openToken = function(state){
      //Inicializar o banco aqui.
      var db = new DataBase();
      var to = new HToken();
      to.setUser('Israel');
      to.setCode('1234');
      to.setCompany('dyd');
      db.createToken(to);
      //db.removeToken();
      var ctrlDb = db.getDB();
      // if none of the above states are matched, use this as the fallback
      //Israel - Read database to find token...
      ctrlDb.get('apptoken', function callback(err, result) {
        if (!err) {
          if (result){ //If exist token...
            console.log(result);
            state.go('token');
          }else{

          }
        }
      }*/

});