sap.ui.define([
] , function () {
    "use strict";
    return {
        toFloat : function (fValue) {
            return Math.floor(fValue*1000)/1000;
        }
    };
}
); 