sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "br/com/gestao/fioriappreport358/util/Formatter",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, Formatter, Fragment) {
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
                var oCategoriaInput = this.getView().byId("productCategoryInput");

                var objFilter = { filters: [], and: true };
                objFilter.filters.push(new Filter("Productid", FilterOperator.Contains, oProdutoInput.getValue()));
                objFilter.filters.push(new Filter("Name", FilterOperator.Contains, oProdutoNomeInput.getValue()));
                objFilter.filters.push(new Filter("Category", FilterOperator.Contains, oCategoriaInput.getValue()));

                //Cria o objeto Filter baseado no valor do objeto
                var oFilter = new Filter(objFilter);

                /*                 var oFilter = new Filter({
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
                                }) */

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

            },
            onCategoria: function (oEvent) {

                this._oInput = oEvent.getSource().getId();
                var oView = this.getView();

                //Verifico se o objeto fragment existe. Se não, crio e adiciona na View
                if (!this._CategoriaSerchHelp) {
                    this._CategoriaSerchHelp = Fragment.load({
                        id: oView.getId(),
                        name: "br.com.gestao.fioriappreport358.frags.SH_Categorias",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }

                this._CategoriaSerchHelp.then(function (oDialog) {

                    //Limpando o filtro de categorias na abertura do fragment
                    oDialog.getBinding("items").filter([]);

                    //Abertura do Fragment
                    oDialog.open();
                })

            },

            onValueHelpSearch: function (oEvent) {

                //Capturando o valor digitado pelo usuário
                var sValue = oEvent.getParameter("value");

                //Opção 1 - Cria um único objeto filtro
                //Criando um objeto do tipo Filter que irá receber o valor e associar na propriedade Description
                //var oFilter = new Filter("Description", FilterOperator.Contains, sValue)
                //oEvent.getSource().getBinding("items").filter([oFilter]);

                //Opção 2- Podemos criar um objeto (dinamico) onde adiciono várias propriedades
                var objFilter = { filters: [], and: false };
                objFilter.filters.push(new Filter("Description", FilterOperator.Contains, sValue));
                objFilter.filters.push(new Filter("Category", FilterOperator.Contains, sValue));

                var oFilter = new Filter(objFilter);
                oEvent.getSource().getBinding("items").filter(oFilter);

            },

            onValueHelpClose: function (oEvent) {

                var oSelectedItem = oEvent.getParameter("selectedItem");
                var oInput = null;

                //Verifica se existe um objeto para o id correspondente para o this._oInput, caso sim, ele cria a referencia
                if (this.byId(this._oInput)) {
                    oInput = this.byId(this._oInput);
                } else {
                    oInput = sap.ui.getCore().byId(this._oInput);
                }

                if (!oSelectedItem) {
                    oInput.resetProperty("value");
                    return;
                }

                oInput.setValue(oSelectedItem.getTitle());
            }

        });
    });
