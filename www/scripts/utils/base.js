function HToken() {
    var user;
    var hcode;
    var company;
    HToken.ns = 'teste';
    this.getUser = function() {
        return this.user;
    }
    this.getCode = function() {
        return this.hcode;
    }
    this.getCompany = function() {
        return this.company;
    }
    this.setUser = function(user) {
        this.user = user;
    }
    this.setCode = function(hcode) {
        this.hcode = hcode;
    }
    this.setCompany = function(company) {
        this.company = company;
    }
};

function DataBase() {
    var db = new PouchDB('clientemototaxi');
    var remoteCouch = false; //To sync...
    DataBase.tmpRes = null;
    var sig;
    //Singleton to database
    DataBase = function() {
        return sig;
    };
    sig = this;

    this.getDB = function() {
        return db;
    };


    this.create = function(key, data) {
        data._id = key;
        db.put(data, function callback(err, result) {
            if (!err) {
                console.log('Successfully posted a data: ' + key);
            } else {
                console.log(err, "ERRROUUUUUU");
            }
        });
    };

    this.delete = function(key) {
        return db.get(key).then(function(doc) {
            return db.remove(doc, function callback(err, result) {
                if (!err) {
                    console.log('Successfully remove a data');
                }
            });
        });
    };

    this.find = function(key) {
        return db.get(key, function callback(err, result) {
            console.log(result);
            if (!err) {
                console.log('Successfully ready a data!');
            } else {
                console.log('Error to ready a data: ' + err);
            }
        });
    };

    this.createToken = function(vToken) {
        var token = {
            _id: 'apptoken',
            user: vToken.getUser(),
            hcode: vToken.getCode(),
            company: vToken.getCompany()
        };
        db.put(token, function callback(err, result) {
            if (!err) {
                console.log('Successfully posted a token!');
            }
        });
    };
    this.removeToken = function() {
        return db.get('apptoken').then(function(doc) {
            return db.remove(doc, function callback(err, result) {
                if (!err) {
                    console.log('Successfully remove a token!');
                }
            });
        });
    };
    this.readToken = function() {
        db.get('apptoken', function callback(err, result) {
            if (!err) {
                console.log('Successfully ready a token!');
            }
        }).then(function(doc) {
            DataBase.tmpRes = doc;
            console.log(DataBase.tmpRes);
        })
        if (DataBase.tmpRes) {
            var res = new HToken();
            console.log(tmpRes);
            res.setUser(DataBase.tmpRes.user);
            res.setCode(DataBase.tmpRes.hcode);
            res.setCompany(DataBase.tmpRes.company);
            return res;
        } else {
            return null;
        }
    };
};