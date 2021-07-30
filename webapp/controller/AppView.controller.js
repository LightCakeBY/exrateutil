sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/ODataModel",
	"exrateutil/model/formatter",
	"exrateutil/model/formatterToFloat",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, oDataModel, formatter, formatterToFloat, MessageToast, 
     	Filter, FilterOperator, MessageBox) {
		"use strict";
		var oModel;
		var currencykey = 'USD';
		var currencykeytab;
		var enddate = new Date();
		var startdate = new Date();
		var sUrl = "/sap/opu/odata/sap/ZSP_C_EXRATE_SB/";

		startdate = startdate.setDate(startdate.getDate()-30);

		return Controller.extend("exrateutil.controller.AppView", {

			formatter: formatter, formatterToFloat,

			onInit: function() {
			
				this.byId("startdate").setMaxDate(new Date());
				this.byId("enddate").setMaxDate(new Date());

				// var sMessage = "Now you see USD rate for last 30 days. Select parameters to see more";
				// MessageToast.show(sMessage, { width: '70%',
				// 								duration: 4500});
												

				//oData Initialization
				oModel = new sap.ui.model.odata.ODataModel(sUrl, {
					useBatch: false
					});
				this.getView().setModel(oModel);
				
				//Filtering
				var oFilter = new sap.ui.model.Filter("currencykey", sap.ui.model.FilterOperator.EQ, 'USD');
				var oFilter2 = new sap.ui.model.Filter("erdate", sap.ui.model.FilterOperator.BT, startdate, enddate);
				oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSP_C_EXRATE_SB/", {
					useBatch: false
					});
				this.getView().setModel(oModel);
				//Binding the filtered data to the chart by callind it from its ID and binding the data there
				this.getView().byId("idVizFrame").getDataset().getBinding("data").filter([oFilter,oFilter2]);

			},

			onFilterInvoices: function (oEvent){

			// build filter array
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			
			if (sQuery) {
				aFilter.push(new Filter("currencykey", FilterOperator.EQ, sQuery));
			}

			// filter binding
			var oList = this.getView().byId("table");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
			},

			onShow: function(oEvent){
				var aFilter = [];
				aFilter.push(new Filter("Currencykey", sap.ui.model.FilterOperator.EQ, currencykey));	
				if (startdate>enddate){
					var t=startdate;
					startdate=enddate;
					enddate=t;
					var sMessage = "Start date and end date was swapped!";
					MessageToast.show(sMessage);
				}
				
				oModel.callFunction('syncButton', {urlParameters:{
					Currencykey : currencykey},
					method:'POST'
					})	
				var sMessage = "Synchronization was succesfull!";
				MessageToast.show(sMessage);
				// MessageToast.show(sMessage, {onClose: this.onFilterInvoices});
				var oFilter = new sap.ui.model.Filter("currencykey", sap.ui.model.FilterOperator.EQ, currencykey);
				var oFilter2 = new sap.ui.model.Filter("erdate", sap.ui.model.FilterOperator.BT, startdate, enddate);
				//Setting oModel
				oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSP_C_EXRATE_SB/", {
					useBatch: true
				});

				this.getView().setModel(oModel);
				//Binding the filtered data to the chart by callind it from its ID and binding the data there
				this.getView().byId("idVizFrame").getDataset().getBinding("data").filter([oFilter,oFilter2]);

				var oList = this.getView().byId("table");
				var oBinding = oList.getBinding("items");
				oBinding.filter([aFilter]);
				// onFilterInvoices(currencykey);
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