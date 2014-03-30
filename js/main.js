var currPage = "first";
var isMyList = true;
var prevScreen = false;
var addButtState = "folded";
var init = function () {

    console.log("init() called");

    document.addEventListener('tizenhwkey', tizenhwkey);
    links = document.getElementsByClassName("link");
    for (i = 0; i < links.lengh; i++) {
        links[i].addEventListener('ontouchstart', scrollPages);
    }

    var element = document.getElementById('page2');
    var hammertime = Hammer(element).on("swiperight", function(event) {
        scrollPages("first");
    });
    bottomSliderWrapper.innerHTML = addNewLinkTemplate.innerHTML;
};
// window.onload can work without <body onload="">
window.onload = init;

function tizenhwkey(e){
	 console.log("tizen key pressed");
	if(e.keyName == "back"){
		if(!prevScreen) {
			tizen.application.getCurrentApplication().exit();
		} else {
			scrollPages("first");
		}
	}    
}


function scrollPages(target, data){
	scroller = document.getElementById("wrapper");
	if (target=="second" && data != undefined){
		drawOnCanvasAsQR(QRcanvas, data);
	}
	wrapper.className = "from_"+currPage+"_to_"+target+" on_"+ target;
	currPage = target;
	console.log("scrollPages called");

	if(target == "first"){
		prevScreen = false;
	} else {
		prevScreen = true;
	}
}
function foldUnfold(){
	if (addButtState == "folded"){
		addButtState = "unfolded";
		addingButton.className = "mainAddingBlock from_fold_to_unfold mainHeadButtonSelected"+ addButtState;
		prevScreen = true;
		
	} else {
		addButtState = "folded";
		addingButton.className = "mainAddingBlock from_unfold_to_fold "+ addButtState;
		prevScreen = false;
	}
	console.log("fold called");
}

function switchSelectedLinkList(el){ //todo change bottom sliding screen inner html
	if (isMyList){
		showMyListButt.className = "mainHeadButton f_l";
		showForeignListButt.className = "mainHeadButton f_l mainHeadButtonSelected";
		isMyList = false
		bottomSliderWrapper.innerHTML = "<div id='camera'></div";
		bottomSliderText.innerHTML = "Сканировать" 
		console.log("opened foreign list")
	} else {
		showMyListButt.className = "mainHeadButton f_l mainHeadButtonSelected";
		showForeignListButt.className = "mainHeadButton f_l";
		bottomSliderWrapper.innerHTML = addNewLinkTemplate.innerHTML;
		bottomSliderText.innerHTML = "Добавить ссылку" 
		isMyList = true
		console.log("opened my list")
	}
	console.log("switchSelectedLinkList called");
}


