window.onerror = function(errorMsg, url, lineNumber) {
	var msg = "Error happened on <"+url+
		"\n> on line "+lineNumber+":\n"+
		errorMsg;
	alert(msg);
}
