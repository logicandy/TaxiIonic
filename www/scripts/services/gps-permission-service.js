angular.module("starter").factory("PermissionService", function($ionicPopup) {
    var self = this;

    var _getPermission = function() {
        console.log("aqui");
        //Se for Android, pede permissão...
        //Premissão-----------------------------------
        self.permissions = cordova.plugins.permissions;
        if (device.platform == 'Android') {
            self.permissions.checkPermission(self.permissions.ACCESS_COARSE_LOCATION, checkPermissionCallback, null);
        } else {
            //showAlertGPS();
        }



    }

    var checkPermissionCallback = function(status) {
        if (!status.hasPermission) {
            var errorCallback = function() {
                console.log('GPS permission is not turned on');
                showAlertGPS();
            }

            self.permissions.requestPermission(
                self.permissions.ACCESS_COARSE_LOCATION,
                function(status) {
                    if (!status.hasPermission) {
                        errorCallback();
                    } else {
                        //verificaPonto();
                    }
                },
                errorCallback);
        } else {
            //showAlertGPS();
        }
    };

    //---------------------------------------------------
    var showAlertGPS = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Problemas com o GPS',
            template: 'GPS desabilitado ou coordenada inesistente.',
            buttons: [{
                text: 'Ok',
                type: 'button-assertive'
            }]
        });

        alertPopup.then(function(res) {
            console.log('alert GPS');
        });
    };


    return {
        getPermission: _getPermission,

    };
});