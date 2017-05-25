// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'ui.mask', 'ionic-toast', 'ui.utils.masks'])

.run(function($ionicPlatform, PermissionService, $ionicHistory, $state, loginService, TripService) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        // setTimeout(function() {
        //     document.getElementById("custom-overlay").style.display = "none";
        // }, 2000)

        var push = PushNotification.init({
            android: {
                senderID: "511906042095",
                sound: true,
                vibrate: true
                    //forceShow: true
            },
            /*browser: {
                pushServiceURL: 'http://push.api.phonegap.com/v1/push'
            },*/
            ios: {
                alert: true,
                badge: true,
                clearBadge: true,
                sound: true
            },
            windows: {}
        });

        push.on('registration', function(data) {
            console.log(data.registrationId);
            var userpushtoken = loginService.getUserPushToken();
            userpushtoken.plataforma = device.platform;
            userpushtoken.token = data.registrationId;
            loginService.setUserPushToken(userpushtoken);
            var db = new DataBase();
            db.create("usuariopushtoken", userpushtoken);
        });

        push.on('notification', function(data) {
            // data.message,
            // data.title,
            // data.count,
            // data.sound,
            // data.image,
            // data.additionalData
            console.log("CHEGOU NOTIFICACAO");
            switch (data.title) {
                case "1":
                    console.log("Achou motorista a corrida");
                    TripService.executeDriverFound(data);
                    break;

                case "2":
                    console.log("começou a corrida");
                    TripService.executeStartedTrip(data);
                    break;

                case "3":
                    console.log("acabou a corrida");
                    TripService.executeEndedTrip(data);
                    break;

                default:
                    console.log("nenhum deles");
                    console.log(data);
                    break;
            }


            if (device.platform == 'iOS') {
                setTimeout(function() {
                    push.finish(function() {
                        console.log("processing of push data is finished");
                    }, function() {
                        console.log("something went wrong with push.finish for ID = " + data.additionalData.notId);
                    }, data.additionalData.notId);
                }, 5000);
            }
        });

        push.on('error', function(e) {
            // e.message
        });

        PermissionService.getPermission();

        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            console.log("chegou");
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);


        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });


})

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // Home screen
        .state('home', {
        //cache: false,
        url: '/home',
        templateUrl: 'templates/home.html',
        controller: 'HomeController as hc'
    })

    // Search for a place
    .state('places', {
        url: '/places',
        cache: false,
        templateUrl: 'templates/places.html',
        controller: 'PlacesController as pc',
        params: {
            type: 0
        },
    })

    // Choose payment method
    .state('payment_method', {
        url: '/payment-method',
        templateUrl: 'templates/payment-method.html',
        controller: 'PaymentMethodCtrl'
    })

    // Find a driver
    .state('finding', {
        url: '/finding',
        templateUrl: 'templates/finding.html',
        controller: 'FindingController as fc'
    })

    // Show driver profile
    .state('driver', {
        url: '/driver',
        templateUrl: 'templates/driver.html',
        controller: 'DriverCtrl'
    })

    // Tracking driver position
    .state('tracking', {
        url: '/tracking',
        templateUrl: 'templates/tracking.html',
        controller: 'TrackingCtrl'
    })

    // Show history
    .state('history', {
        url: '/history',
        templateUrl: 'templates/history.html',
        controller: 'HistoryCtrl'
    })

    // Show notifications
    .state('notification', {
        url: '/notification',
        templateUrl: 'templates/notification.html',
        controller: 'NotificationCtrl'
    })

    // Support form
    .state('support', {
        url: '/support',
        templateUrl: 'templates/support.html',
        controller: 'SupportCtrl'
    })

    // Profile page
    .state('profile', {
        url: '/profile',
        cache: false,
        templateUrl: 'templates/profile.html',
        controller: 'ProfileController as pc'
    })

    // login screen
    .state('login', {
        url: '/login',
        cache: false,
        templateUrl: 'templates/login.html',
        controller: 'loginController as lc'
    })

    .state('recover', {
        url: '/recover-password',
        cache: false,
        templateUrl: 'templates/recover-password.html',
        controller: 'senhaController as sc'
    })

    // register screen
    .state('register', {
            url: '/register',
            cache: false,
            templateUrl: 'templates/register.html',
            controller: 'registerController as rc'
        })
        // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise(function($injector, $location) {
        var state = $injector.get('$state');
        console.log("SPLASSHHHH");
        var db = new DataBase();
        db.getDB().get("cliente", function callback(err, result) {
            if (result == undefined) {
                state.go('login');
            }
        }).then(function(doc) {
            console.log(doc);
            state.go('home');
        });

        return $location.path();
    });

});