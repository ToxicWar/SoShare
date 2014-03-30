var Browser = (function () {
	var browser = {};
	browser.openUrl = function(url, callbacs){
		callbacs = callbacs || {};
		var appControl = new tizen.ApplicationControl("http://tizen.org/appcontrol/operation/view", url);
		var success = function(){};
		var fail = function(e){};

		if (callbacs['success']) {
			success = callbacs['success'];
		}
		
		if (callbacs['fail']) {
			fail = callbacs['fail'];
		}
		
		tizen.application.launchAppControl(appControl, null, success, fail);
	}

	return browser;
}());