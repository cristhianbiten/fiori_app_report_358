sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/format/DateFormat"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, DateFormat) {
        "use strict";

        return Controller.extend("br.com.gestao.fioriappreport358.controller.Lista", {
            onInit: function () {

                //Busca informações das configurações
                var oConfiguration = sap.ui.getCore().getConfiguration();
                //Configura o formatador para o local
                oConfiguration.setFormatLocale("pt-BR");
            },

            onSearch: function () {

                //Capturando individulamente cada objeto Input do objeto Filter Bar
                var oProdutoInput = this.getView().byId("productIDInput");
                var oProdutoNomeInput = this.getView().byId("productNameInput");

                //Cria o objeto Filter baseado no valor do objeto
                var oFilter = new Filter({
                    filters: [
                        new Filter({
                            path: "Productid",
                            operator: FilterOperator.Contains,
                            value1: oProdutoInput.getValue(),
                        }),
                        new Filter({
                            path: "Name",
                            operator: FilterOperator.Contains,
                            value1: oProdutoNomeInput.getValue(),
                        }),
                    ],
                    and: true
                })

                //Busca objeto Table
                var oTable = this.getView().byId("tableProdutos");

                //Localiza a agregação items onde sabemos qual a entetidade onde será aplicado o filtro
                var binding = oTable.getBinding("items");

                //É aplicado o filtro para o databinding
                binding.filter(oFilter);
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

            onRouting: function () {

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("Detalhes");

            },

            onSelectedItem: function (oEvent) {

                //var oProductId = oEvent.getSource().getBindingContext().getObject().Productid;

                // Nós acessamos um contexto de um model com nome 
                //var oProductId = oEvent.getSource().getBindingContext("Nome do Model").getProperty("Productid");

                // Passo 1 - Captura do valor do produto (id)
                var oProductId = oEvent.getSource().getBindingContext().getProperty("Productid");

                // Passo 2 - Envio para o Route de Detalhes com parametro
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("Detalhes", { productId: oProductId });

            }

        });
    });
