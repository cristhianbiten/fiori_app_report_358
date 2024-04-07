sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/format/NumberFormat"
  ],
  function (BaseController, DateFormat, NumberFormat) {
    "use strict";

    return BaseController.extend("br.com.gestao.fioriappreport358.controller.Detalhes", {

      //Criar o meu objeto Route e acoplando a função que fará o bindingElement
      onInit: function () {

        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.getRoute("Detalhes").attachMatched(this.onBindingProdutoDetalhes, this);

      },

      onBindingProdutoDetalhes: function (oEvent) {

        // Capturando o parametro trafegado no Route Detalhes (productId)
        var oProduto = oEvent.getParameter("arguments").productId;

        // Objeto referente a view Detalhes
        var oView = this.getView();

        // Criar a URL de chamada da nossa entidade de Produtos
        var sUrl = "/Produtos('" + oProduto + "')";

        oView.bindElement({
          path: sUrl,
          parameters: { expand: 'to_Cat' },
          events: {
            change: this.onBindingChange.bind(this),
            dataRequested: function () {
              oView.setBusy(true);
            },
            dataReceived: function () {
              oView.setBusy(false);
            },
          }
        })

      },

      onBindingChange: function (oEvent) {

        var oView = this.getView();
        var oElementBinding = oView.getElementBinding();

        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

        //Se não existir um elemento (registro) válido eu farei uma ação que é redirecionar para uma nova View
        if (!oElementBinding.getBoundContext()) {
          oRouter.getTargets().display("objNotFound");
          return;
        }

      },

      onNavBack: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("Lista");
      },

      date: function (value) {

        //Busca informações das configurações
        var oConfiguration = sap.ui.getCore().getConfiguration();
        //Busca o local
        var oLocale = oConfiguration.getFormatLocale();

        var oPattern;

        if (oLocale === "pt-BR") {
            oPattern = "dd/MM/yyyy";
        } else {
            oPattern = "MM/dd/yyyy";
        }

        if (value) {
            var year = new Date(value).getFullYear();
            if (year === 9999) {
                return "";
            } else {
                var oDateFormat = DateFormat.getDateTimeInstance({
                    //style: "short"
                    pattern: oPattern
                });

                return oDateFormat.format(new Date(value));
            }
        } else {
            return value;
        }

    },
    // Apresentar o texto do status mediante a propriedade Status do model
    statusProduto: function (value) {
        // Busca informações do arquivo i18n
        var oBundle = this.getView().getModel("i18n").getResourceBundle();

        try {
            return oBundle.getText("status" + value);
        } catch (error) {
            return "";
        }
    },

    //Apresentar o estado (cor) do objeto status mediante a propriedade Status do model
    stateProduto: function (value) {

        try {

            const statusMap = {
                "E": "Success",
                "P": "Warning",
                "F": "Error"
            };

            return statusMap[value] || "None";

        } catch (error) {
            return "None";
        }
    },
    //Apresentar o ícone correspondente mediante a propriedade Status do model
    iconProduto: function (value) {

        try {

            const iconMap = {
                "E": "sap-icon://sys-enter-2",
                "P": "sap-icon://alert",
                "F": "sap-icon://error"
            };

            return iconMap[value] || "";

        } catch (error) {
            return "";
        }
    },
    //Apresentar os valores númericos formatados tipo decimal
    floatNumber: function (value) {

      var numFloat = NumberFormat.getFloatInstance( {
        maxFractionDigits: 2,
        minFractionDigits: 2,
        groupingEnabled: true,
        groupingSeparator: ".",
        decimalSeparator: ","
      })

      return numFloat.format(value);

    },
    });
  }
);
