function drawOnCanvasAsQR(canvas, text) {
	var rc = canvas.rc || canvas.getContext("2d");
	var s = window.devicePixelRatio || 1;
	var w = canvas.offsetWidth * s;
	var h = canvas.offsetHeight * s;
	
	if (canvas.width != w) canvas.width = w;
	if (canvas.height != h) canvas.height = h;
	
	var qr = qrcode(1, 'L');
	qr.addData(text);
	qr.make();
	var c = qr.getModuleCount();
	
	rc.save();
	rc.clearRect(0, 0, w, h);
	rc.scale(w/c, h/c);
	for (var i=0; i<c; i++) {
		for (var j=0; j<c; j++) {
			if (qr.isDark(j,i)) rc.fillRect(i, j, 1, 1);
		}
	}
	rc.restore();
}
