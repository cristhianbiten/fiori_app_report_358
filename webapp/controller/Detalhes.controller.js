sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "br/com/gestao/fioriappreport358/util/Formatter"
  ],
  function (Controller, Formatter) {
    "use strict";

    return Controller.extend("br.com.gestao.fioriappreport358.controller.Detalhes", {

      objFormatter: Formatter,

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
    });
  }
);
