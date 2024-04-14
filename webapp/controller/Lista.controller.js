sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "br/com/gestao/fioriappreport358/util/Formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, Formatter) {
        "use strict";

        return Controller.extend("br.com.gestao.fioriappreport358.controller.Lista", {

            objFormatter: Formatter,

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
