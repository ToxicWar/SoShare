var currPage = "first";


//Initialize function
var init = function () {
    // TODO:: Do your initialization job
    console.log("init() called");
    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
            tizen.application.getCurrentApplication().exit();
    });
    links = document.getElementsByClassName("link")
    for (i = 0; i < links.lengh; i++){
    	links[i].addEventListener('ontouchstart', scrollPages)
    }
};
// window.onload can work without <body onload="">
window.onload = init;


function scrollPages(target, data){
	scroller = document.getElementById("wrapper");
	if (target=="second" && data != undefined){
		generateQR(data)
	}
	wrapper.className = "from_"+currPage+"_to_"+target+" on_"+ target;
	currPage = target;
	console.log("scrollPages called")
}
	
function generateQR(data){
	//TODO
}





