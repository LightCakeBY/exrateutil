//создаем объект с маршрутами
var viewRouters = [ 
	{ //первый
		pattern: "", //тут задается паттерн для перехода между страницами
		name: "AppView", //имя представления
		view: "sapui5_routers.main_view", //полный путь до представления, начиная  с ресурса
		view_type: sap.ui.core.mvc.ViewType.JS, //тип представления (JS в моем случае)
		targetControl: "appId", //id приложения (задается на index.html)
		clearTarged: true,
		callback: function() {  //функция, которая осущ-т переход м-у страницами
			myCallback(this);
		}
	},
	
	{ //второй
		name: "DiagramView",
		view: "sapui5_routers.second_view",
		view_type: sap.ui.core.mvc.ViewType.JS,
		targetControl: "appId",
		clearTarged: true,
		callback: function() {
			myCallback(this);
		}
	}
];
 
//функция, которая динамически формирует имя представления и переходит на него
myCallback = function($this) {
    var viewId = "idmain_" + $this.name; //формируем ИД представления (динамически для удобства)
	var app = sap.ui.getCore().byId("appId");
	app.to(viewId); // переходим по ссылке
	        
};
 
var oRouter = new sap.ui.core.routing.Router(viewRouters); //создаем объект
 
oRouter.register("routerId"); //регистрируем его ИД
oRouter.initialize();