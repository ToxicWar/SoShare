var STORAGE = (function () {
	var storage = {};
	storage.setVariable = function(name, data){
		window.localStorage[name] = data;
	}

	storage.getVariable = function(name){
		return window.localStorage[name];
	}

	return storage;
}());