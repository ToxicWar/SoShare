var Storage = (function () {
	var storage = {};
	storage.setVariable = function(name, data){
		window.localStorage.setItem(name, JSON.stringify(data));
	};

	storage.getVariable = function(name){
		return JSON.parse(window.localStorage.getItem(name));
	};

	return storage;
}());