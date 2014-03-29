var currPage = "first";
var prevScreen = false;

var init = function () {

    console.log("init() called");

    document.addEventListener('tizenhwkey', tizenhwkey);
    links = document.getElementsByClassName("link")
    for (i = 0; i < links.lengh; i++){
    	links[i].addEventListener('ontouchstart', scrollPages)
    }

    var element = document.getElementById('page3');
    var hammertime = Hammer(element).on("swiperight", function(event) {
    	scrollPages("first")
    });
};
// window.onload can work without <body onload="">
window.onload = init;

function tizenhwkey(e){
	 console.log("tizen key pressed");
	if(e.keyName == "back"){
		if(!prevScreen) {
			tizen.application.getCurrentApplication().exit();
		} else {
			scrollPages("first")
		}
	}    
}


function scrollPages(target, data){
	scroller = document.getElementById("wrapper");
	if (target=="second" && data != undefined){
		drawOnCanvasAsQR(QRcanvas, data)
	}
	wrapper.className = "from_"+currPage+"_to_"+target+" on_"+ target;
	currPage = target;
	console.log("scrollPages called")

	if(target == "first"){
		prevScreen = false;
	} else {
		prevScreen = true;
	}
}

// Remove
function testWrite(){
	var elem = document.getElementById("test-name");
	console.log(elem.value);
	window.localStorage.test = elem.value;
}
// End remove

