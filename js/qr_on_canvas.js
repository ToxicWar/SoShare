var typeNumbers = [0, 17, 32, 53, 78, 106, 134, 154, 192, 230, 271];

function getBestTypeNumberForLength(len) {
	var i = 0;
	while (len > typeNumbers[++i]) {}
	return i;
}

function drawOnCanvasAsQR(canvas, text) {
	var rc = canvas.rc || canvas.getContext("2d");
	var s = window.devicePixelRatio || 1;
	var w = canvas.offsetWidth * s;
	var h = canvas.offsetHeight * s;
	
	if (canvas.width != w) canvas.width = w;
	if (canvas.height != h) canvas.height = h;
	

	var typeNumber = getBestTypeNumberForLength(text.length);
	var qr = qrcode(typeNumber, 'L');

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

function writeToCanvasAsQR(canvas, text) {
	var rc = canvas.rc || canvas.getContext("2d");
	var s = window.devicePixelRatio || 1;
	
	var qr = qrcode(1, 'L');
	qr.addData(text);
	qr.make();
	var c = qr.getModuleCount();
	
	var xk = Math.max(1, Math.round(canvas.offsetWidth  * s / c));
	var yk = Math.max(1, Math.round(canvas.offsetHeight * s / c));
	
	var w = xk * c;
	var h = yk * c;
	
	if (canvas.width != w) canvas.width = w;
	if (canvas.height != h) canvas.height = h;
	
	var idata = rc.getImageData(0, 0, w, h);
	var data = idata.data;
	for (var i=0; i<c; i++) {
		var xo = i*xk;
		for (var j=0; j<c; j++) {
			if (!qr.isDark(j,i)) continue;
			var yo = j*yk;
			for (var m=0; m<xk; m++)
				for (var n=0; n<yk; n++) {
					var pos = ((xo+m) + (yo+n)*w)*4;
					data[pos  ] = 0;
					data[pos+1] = 0;
					data[pos+2] = 0;
					data[pos+3] = 255;
				}
		}
	}
	rc.putImageData(idata, 0 ,0);
}
