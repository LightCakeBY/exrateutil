sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/ODataModel",
	"exrateutil/model/formatter",
	"exrateutil/model/formatterToFloat",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, oDataModel, formatter, formatterToFloat, MessageToast, 
     	Filter, FilterOperator) {
		"use strict";
		var oModel;
		var currencykey = 'USD';
		var startdate = new Date();
		var enddate = new Date();
		var sUrl = "/sap/opu/odata/sap/ZSP_C_EXRATE_SB/";


		return Controller.extend("exrateutil.controller.AppView", {

			formatter: formatter, formatterToFloat,

			onInit: function() {
			
				this.byId("startdate").setMaxDate(new Date());
				this.byId("enddate").setMaxDate(new Date());

				//oData Initialization
				oModel = new sap.ui.model.odata.ODataModel(sUrl, {
					useBatch: false
					});
				this.getView().setModel(oModel);
				
				//Filtering
				var oFilter = new sap.ui.model.Filter("currencykey", sap.ui.model.FilterOperator.EQ, 'USD');
				oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSP_C_EXRATE_SB/", {
					useBatch: false
					});
				this.getView().setModel(oModel);
				//Binding the filtered data to the chart by callind it from its ID and binding the data there
				this.getView().byId("idVizFrame").getDataset().getBinding("data").filter([oFilter]);

			},

		/* 	onSynchronization: function (oEvent) {

				oModel.callFunction('syncButton', { urlParameters:{
					Currencykey : currencykey},
					method:'POST'
					 })	
			var sMessage = "Synchronization was succesfull!";
			MessageToast.show(sMessage);

			}, */

			onShow: function(){

				if (startdate>enddate){
					var t=startdate;
					startdate=enddate;
					enddate=t;
					var sMessage = "Start date and end date was swapped!";
					MessageToast.show(sMessage);
				}

				oModel.callFunction('syncButton', { urlParameters:{
					Currencykey : currencykey},
					method:'POST'
					 })	
				var sMessage = "Synchronization was succesfull!";
				MessageToast.show(sMessage);

				var oFilter = new sap.ui.model.Filter("currencykey", sap.ui.model.FilterOperator.EQ, currencykey);
				var oFilter2 = new sap.ui.model.Filter("erdate", sap.ui.model.FilterOperator.BT, startdate, enddate);
				//Setting oModel
				oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSP_C_EXRATE_SB/", {
					useBatch: true
					});
				this.getView().setModel(oModel);

				//Binding the filtered data to the chart by callind it from its ID and binding the data there
				this.getView().byId("idVizFrame").getDataset().getBinding("data").filter([oFilter,oFilter2]);
			},

			onSetStartDate: function(oEvent){
				startdate = new Date (oEvent.getParameters().value);
				startdate = startdate.setDate(startdate.getDate()+1);
				console.log(startdate);
			},

			onSetEndDate: function(oEvent){
				enddate = new Date (oEvent.getParameters().value);
				enddate = enddate.setDate(enddate.getDate()+1);
				console.log(enddate);
			},

			onSetCurrency: function(oEvent){
				currencykey = oEvent.getParameters().value;
				console.log(currencykey);							
			},

			onChangeData: function(oEvent){	
				console.log(startdate);
				console.log(enddate);
				console.log(currencykey);
			}
	});
});