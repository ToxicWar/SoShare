var selfCamera;
	function SelfCamera(qrCallback) {
		qrcode.callback = qrCallback;
		//qrcode.debug = true;
	};

	(function () {
		//var previewLock = false;
	
		SelfCamera.prototype = {
			countdownTimeoutID: -1,
			img: null,
			//filename: '',
			video: null,
			src: null,
			onQR: null,
			isMediaWorking: false
		};
	
		SelfCamera.prototype.onCaptureVideoSuccess = function onCaptureVideoSuccess(stream) {
			var urlStream = window.webkitURL.createObjectURL(stream);
			this.isMediaWorking = true;
			this.createCanvas();
			this.createVideoElement(urlStream);
			setInterval(this.captureImage.bind(this, 320), 1000);
		};
		
		SelfCamera.prototype.createCanvas = function() {
			this.img = document.createElement('canvas');
			this.img.id = 'qr-canvas';
			// что это за id, и пара слов о самой распознавалке:
			// не знаю, чем они там обкуривались, но декодер работает двумя способами:
			// 1) принимает путь к картинке с куером или её base64,
			//    создаёт НОВУЮ КАРТИНКУ с переданным src,
			//    создаёт НОВЫЙ КАНВАС, рисует на него картинку,
			//    распознаёт с getImageData канваса
			// 2) принимает ничего,
			//    ищет канвас с id='qr-canvas',
			//    распознаёт с getImageData канваса
			// ИМХО пара новых канвасов в секунду - не лучшая идея, поэтому вариант (2)
			
			if (qrcode.debug) {
				this.img.style.position = 'fixed';
				this.img.style.top = this.img.style.left = 0;
				
				var div = document.createElement("div");
				div.id = 'dbg';
				div.style.position = 'fixed';
				div.style.left = 0;
				div.style.top = 0;
				div.style.zIndex = 100;
				div.style.color = 'white';
				document.body.appendChild(div);
			} else {
				this.img.style.display = 'none';
			}
			document.body.appendChild(this.img); // а это чтоб getElementById его нашёл
		}
	
		SelfCamera.prototype.createVideoElement = function (src) {
			var video = document.createElement('video');
			//video.id = 'video';
			video.autoplay = 'autoplay';
			video.style.height = window.innerHeight + 'px';
			video.src = src;
			camera.appendChild(video);
			this.video = video;
	
			this.bindVideoEvents();
		};
	
		SelfCamera.prototype.onCaptureVideoError = function onCaptureVideoError(e) {
			// alert("Video Capture Error");
			console.error(e);
		};
	
		SelfCamera.prototype.startPreview = function startPreview() {
			var options = {
				audio: false, // FALSE THIS!!!
				video: true
			};
	
			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
			try {
				if (typeof (navigator.getUserMedia) === 'function') {
					navigator.getUserMedia(options, this.onCaptureVideoSuccess.bind(this), this.onCaptureVideoError.bind(this));
				}
			} catch (e) {
				alert('navigator.getUserMedia() error.');
				console.error('navigator.getUserMedia() error: ' + e.message);
			}
	
		};
	
		SelfCamera.prototype.captureImage = function captureImage(w) {
			/*var sourceWidth = window.innerWidth,
				sourceHeight = window.innerHeight,
				sourceX = (sourceWidth - $(video).width()) / 2,
				sourceY = (sourceHeight - $(video).height()) / 2;
	
			this.img.width = sourceWidth;
			this.img.height = sourceHeight;
	
			// Crop image to viewport dimension
			this.img.getContext('2d').drawImage(video, sourceX, sourceY, $(video).width(), $(video).height());*/
			
			if (this.video.videoWidth <= 0 || this.video.videoHeight <= 0) return;
	
			var scale = w ? Math.min(Math.min(w/this.video.videoWidth, w/this.video.videoHeight), 1) : 1;
			
			this.img.width = this.video.videoWidth * scale;
			this.img.height = this.video.videoHeight * scale;
			
			console.log(" --- captiring with size: "+this.img.width+"x"+this.img.height+" --- ");
			var rc = this.img.getContext('2d');
			
			//rc.translate(this.img.width, 0);
			//rc.scale(-this.img.width/this.video.videoWidth, this.img.height/this.video.videoHeight);
			rc.scale(this.img.width/this.video.videoWidth, this.img.height/this.video.videoHeight);
			
			console.log(" --- drawing on canvas --- ");
			rc.drawImage(this.video, 0, 0);
			try {
				console.log(" --- starting decode --- ");
				qrcode.decode(); // капчуринг из канваса #qr-canvas здесь
				console.log(" --- decoded (or not) --- ");
			} catch(e) {
				console.log(e);
				if (e.stack){ console.log(e.stack) }
				if (qrcode.debug) dbg.innerText = e.toString();
			}
		};
	
		SelfCamera.prototype.resizeVideo = function() {
			var w = this.video.videoWidth,
				h = this.video.videoHeight,
				W = window.innerWidth,
				H = window.innerHeight,
				wide = w/h >= W/H,
				margin,
				size,
				vs = this.video.style;
			if (w <= 0 || h <= 0) {
				setTimeout(this.resizeVideo.bind(this), 100); // wait for stream
				return;
			}
			if (wide) {
				size = Math.round(w * H / h);
				margin = (W - size) / 2,
				vs.marginLeft = margin + 'px';
				vs.marginTop  = 0;
				vs.width  = size + 'px';
				vs.height =    H + 'px';
			} else {
				size = Math.round(h * W / w);
				margin = (H - size) / 2,
				vs.marginLeft = 0;
				vs.marginTop  = margin + 'px';
				vs.width  =    W + 'px';
				vs.height = size + 'px';
			}
			camera.style.width  = W + 'px';
			camera.style.height = H + 'px';
		}
	
		SelfCamera.prototype.bindVideoEvents = function () {
			this.video.onstalled = function(e){ this.load(); };
			this.video.onplaying = this.resizeVideo.bind(this);
			this.video.onclick = function(e){ e.preventDefault(); this.captureImage() }.bind(this);//function(){ this.play(); };
		};
	
		SelfCamera.prototype.bindEvents = function bindEvents() {
			var self = this;
	
			//document.addEventListener('webkitvisibilitychange', function (event) {
			//	previewLock = false;
			//});
	
			/*$('shutter').mousedown(function (ev) {
				$('shutter').addClass('active');
			}).mouseup(function (ev) {
				$('shutter').removeClass('active');
			}).on('touchstart', function (ev) {
				$('shutter').addClass('active');
			}).on('touchend', function (ev) {
				$('shutter').removeClass('active');
			});*/
	
			window.ontizenhwkey = function (e) {
				if (e.originalEvent.keyName === "back") {
					if (self.countdownTimeoutID !== -1) {
					} else {
						tizen.application.getCurrentApplication().exit();
					}
				}
			};
		};
	
		SelfCamera.prototype.init = function init() {
			var self = this;
			self.startPreview();
			self.bindEvents();
		};
	
	}());
