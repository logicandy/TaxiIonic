//Serviço responsável por carregar todas as informações relevantes à persistência da corrida. Deve ser chamado em todas as telas.

angular.module("starter").factory("corridaService", function($http, config) {
    var self = this;

    self.corridaEndereco = new Array();
    self.tipoPagamento = 1;
    self.observacao = "";
    self.colete = false;
    self.bau = false;
    self.motoGrande = false;
    self.padronizada = false;
    self.dataCorrida = "";
    self.agendado = false;
    self.valor = 0;
    self.enderecoIndex = 0;
    self.cliente = new Object();

    $http.defaults.headers.common['Authorization'] = config.token;

    var _limpar = function() {
        self.corridaEndereco.splice(0, self.corridaEndereco.length);
        self.tipoPagamento = 1;
        self.observacao = "";
        self.colete = false;
        self.bau = false;
        self.motoGrande = false;
        self.padronizada = false;
        self.dataCorrida = false;
        self.agendado = false;
        self.valor = 0;
        self.enderecoIndex = 0;
        self.cliente = new Object();
    };


    var _salvar = function(callBackSuccess, callBackError) {
        console.log(self.corridaEndereco);
        var corrida = new Object();
        corrida.tipoPagamento = self.tipoPagamento;
        corrida.observacao = self.observacao;

        if (self.dataCorrida) {
            var tmpDate = new Date(self.dataCorrida);
            var formattedDate = moment(tmpDate).format('DD/MM/YYYY HH:mm');
            corrida.dataCorrida = formattedDate;
        }

        corrida.valor = self.valor;
        corrida.enderecoCorridas = self.corridaEndereco;

        if (self.agendado) {
            corrida.statusCorrida = "A"; //AGENDADA
        } else {
            corrida.statusCorrida = "P"; //PENDENTE
        }

        corrida.motoGrande = self.motoGrande;
        corrida.padronizada = self.padronizada;
        corrida.bau = self.bau;

        //Ponto para alteração empresa...
        // if (!self.cliente.empresa) {
        //     corrida.cliente = {};
        //     corrida.cliente.id = self.cliente.id;
        // } else {
        //     corrida.empresa = {};
        //     corrida.empresa.id = self.cliente.id;
        // }

        corrida.cliente = {};
        corrida.cliente.id = 1;

        corrida.telefone = self.cliente.telefone;

        console.log(corrida);
        // Pronto para persistir. Aguardar mudanças no banco e no Webservice
        $http.post(config.baseUrl + "corridas", corrida)
            .then(
                function(success) {
                    //callBackSuccess(success);
                    _limpar();
                    console.log("Dado persistido!");
                },
                function(error) {
                    //callBackError(error);
                    console.log(error);
                });
        return corrida;
    };

    var _setDados = function(observacao, agendamento, bau, colete, motoGrande, dataCorrida, callBack) {
        this.observacao = observacao;
        this.agendamento = agendamento;
        this.bau = bau;
        this.colete = colete;
        this.motoGrande = motoGrande;
        this.dataCorrida = dataCorrida;
        return callBack(bau);
    };

    var _getValor = function() {
        return self.valor;
    };

    var _setValor = function(valor) {
        self.valor = valor;
    };

    var _getDataCorrida = function() {
        return self.dataCorrida;
    };

    var _setDataCorrida = function(data) {
        self.dataCorrida = data;
    };

    var _hasColete = function() {
        return self.colete;
    };

    var _hasBau = function() {
        return self.bau;
    };

    var _hasMotoGrande = function() {
        return self.motoGrande;
    };


    var _hasPadronizada = function() {
        return self.padronizada;
    };


    var _isAgendado = function() {
        return self.agendado;
    };

    var _getObservacao = function() {
        return self.observacao;
    };

    var _setColete = function(colete) {
        self.colete = colete;
    };

    var _getCliente = function() {
        return self.cliente;
    };

    var _setCliente = function(cliente) {
        self.cliente = cliente;
    };

    var _setBau = function(bau) {
        self.bau = bau;
    };

    var _setMotoGrande = function(motoGrande) {
        self.motoGrande = motoGrande;
    };

    var _setPadronizada = function(padronizada) {
        self.padronizada = padronizada;
    };

    var _setAgendado = function(agendado) {
        self.agendado = agendado;
    };

    var _setObservacao = function(obs) {
        self.observacao = obs;
    };

    var _getTipoPagamento = function() {
        return self.tipoPagamento;
    };

    var _setTipoPagamento = function(tipo) {
        self.tipoPagamento = tipo;
    };

    var _hasDoisEnderecos = function() {
        return self.corridaEndereco.length >= 2;
    };

    var _getCorridaEndereco = function() {
        var enderecos = new Array();
        for (var i = 0; i < self.corridaEndereco.length; i++) {
            var endereco = {};
            endereco.latitude = self.corridaEndereco[i].latitude;
            endereco.longitude = self.corridaEndereco[i].longitude;
            endereco.enderecoFormatado = self.corridaEndereco[i].enderecoFormatado;
            endereco.bairro = self.corridaEndereco[i].bairro;
            endereco.cidade = self.corridaEndereco[i].cidade;
            enderecos.push(endereco);
        }
        return enderecos;
    };

    var _setComponents = function(endereco) {
        for (var i = 0; i < endereco.componentes.length; i++) {
            for (var j = 0; j < endereco.componentes[i].types.length; j++) {
                var type = endereco.componentes[i].types[j];
                switch (type) {
                    case "street_number":
                        endereco.numero = endereco.componentes[i].long_name;
                        break;
                    case "route":
                        endereco.logradouro = endereco.componentes[i].long_name;
                        break;
                    case "sublocality":
                        endereco.bairro = endereco.componentes[i].long_name;
                        break;
                    case "locality":
                        endereco.cidade = endereco.componentes[i].long_name;
                        break;
                    case "administrative_area_level_2":
                        endereco.cidade = endereco.componentes[i].long_name;
                        break;
                    case "administrative_area_level_1":
                        endereco.uf = endereco.componentes[i].short_name;
                        break;
                    case "postal_code":
                        endereco.cep = endereco.componentes[i].long_name;
                        break;
                }
            }
        }
        delete endereco.componentes;
        console.log(endereco);
    };

    var _addCorridaEndereco = function(endereco) {
        console.log("Endereço adicionado: " + endereco.enderecoFormatado);
        if (endereco.componentes) {
            _setComponents(endereco);
            // endereco.ordem = self.enderecoIndex;
            // endereco.origem = self.enderecoIndex == 0;
        }
        self.corridaEndereco[endereco.ordem] = endereco;
    };

    var _isRemovable = function() {
        if (self.enderecoIndex >= self.corridaEndereco.length)
            return -2; //Desabilitar botão pois o índice passado é maior do que o array de endereços.
        if (self.enderecoIndex == 0 || self.corridaEndereco.length == 1)
            return -1; //Só há o endereço de origem.
        if (self.enderecoIndex == 1 && self.corridaEndereco.length == 2)
            return 0; //Só há um endereço de destino.
        return 1;
    }
    var _delCorridaEndereco = function() {
        self.corridaEndereco.splice(self.enderecoIndex, 1);
    }

    var _setEnderecoIndex = function(index) {
        self.enderecoIndex = index;
    }

    var _getEndereco = function() {
        if (!self.corridaEndereco[self.enderecoIndex])
            return new Object();
        return self.corridaEndereco[self.enderecoIndex];
    }

    return {
        getCorridaEndereco: _getCorridaEndereco,
        addCorridaEndereco: _addCorridaEndereco,
        delCorridaEndereco: _delCorridaEndereco,
        hasDoisEnderecos: _hasDoisEnderecos,
        getTipoPagamento: _getTipoPagamento,
        setTipoPagamento: _setTipoPagamento,
        setEnderecoIndex: _setEnderecoIndex,
        getEndereco: _getEndereco,
        isRemovable: _isRemovable,
        hasColete: _hasColete,
        hasBau: _hasBau,
        hasMotoGrande: _hasMotoGrande,
        hasPadronizada: _hasPadronizada,
        isAgendado: _isAgendado,
        getObservacao: _getObservacao,
        setColete: _setColete,
        setBau: _setBau,
        setMotoGrande: _setMotoGrande,
        setPadronizada: _setPadronizada,
        setAgendado: _setAgendado,
        setObservacao: _setObservacao,
        getDataCorrida: _getDataCorrida,
        setDataCorrida: _setDataCorrida,
        getValor: _getValor,
        setCliente: _setCliente,
        getCliente: _getCliente,
        setDados: _setDados,
        setValor: _setValor,
        limpar: _limpar,
        salvar: _salvar
    };
});