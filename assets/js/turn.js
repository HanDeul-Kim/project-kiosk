import { initLang, setTexts, lang, lastLang, langFile } from './lang.js'
//* ===================================================================
//*                             settings                               
//* ===================================================================
duration = 800
// progressbar - double
var pInner = document.querySelector(".progressbar-inner");
var progressbar = document.querySelector(".progressbar");

// progressbar - single
var pInnerSingle = document.querySelector(".progressbar-inner-single");
var progressbarS = document.querySelector(".progressbar-single");

// complete png
var dotImg = document.querySelector(".dot-img");
var dotImgSingle = document.querySelector(".dot-img-single");

//* ===================================================================
//*                              initial                               
//* ===================================================================
turnEl = document.querySelector('.flipbook')
pages = document.getElementsByClassName('page').length



if (getOrient()) {
    display = 'single'
} else {
    display = 'double';
}
if (landScape()) {
    display = 'double';
}




$(turnEl).turn({ display, duration, pages, acceleration: false, inclination: 0 }) //elevation: 0

//- ------------------------- temp page go ----------------------------
// $(turnEl).turn('page', 2)
// if($(turnEl).turn('page', 1)){
//     var audioBack = document.getElementById('audio_back')
//     var sourceBack = document.getElementById('source_back')
//     sourceBack.src = `./assets/audio/background.mp3`
//     audioBack.load();
//     audioBack.play();
// }



//- -------------------------- load Wegbl -----------------------------
$(turnEl).bind('turning', function (e, page, view) {
    // setTexts(initLang())
    // setTexts()
    if (lastLang) setTexts(lastLang)
    else setTexts(lang)

    
    // // 공룡 배경음
    // var audioBack = document.getElementById('audio_back')
    // var sourceBack = document.getElementById('source_back')
    // sourceBack.src = `./assets/audio/background.mp3`
    // audioBack.load();
    // audioBack.play();

    audio.pause();
    audioModal.pause();
},)

$(turnEl).bind('turned', function (e, page, view) {
    outIframe()
    if (view.includes(8)) addIframe('wg01.html', '08')
    else if (view.includes(10)) addIframe('wg02.html', '10')
    else if (view.includes(12)) addIframe('wg03.html', '12')
    else if (view.includes(14)) addIframe('wg04.html', '14')
    else if (view.includes(16)) addIframe('wg05.html', '16')
    else if (view.includes(18)) addIframe('wg06.html', '18')
    else if (view.includes(20)) addIframe('wg07.html', '20')
    else if (view.includes(22)) addIframe('wg08.html', '22')
    else if (view.includes(24)) addIframe('wg09.html', '24')
    else if (view.includes(26)) addIframe('wg10.html', '26')


    
})

//- ---------------------------- corner -------------------------------
$(turnEl).bind('start', function (e, page, corner) {
    if (corner == 'tl' || corner == 'tr' || corner == 'bl' || corner == 'br') {
        let iframe = document.querySelector('iframe')
        turnEl.addEventListener('mousedown', () => {
            if (iframe) iframe.style.pointerEvents = 'none'
        })
        turnEl.addEventListener('mouseup', () => {
            if (iframe) iframe.style.pointerEvents = 'auto'
        })

    }

 
})




//- ----------------------- button prev next --------------------------
let flipBtnR = document.querySelector('.flipBtnR')
let flipBtnL = document.querySelector('.flipBtnL')
flipBtnL.style.display = 'none'
flipBtnR.addEventListener('click', () => $(turnEl).turn('next'))
flipBtnL.addEventListener('click', () => $(turnEl).turn('previous'))
// $(turnEl).bind('start', function(e, page, corner) { })
$(turnEl).bind('turning', function (e, page, view) {

    var endPage = view.includes(pages)
    var beginPage = view.includes(0)

    var box = view[0];



    // doubleLayout - progressbar
    function doubleMode() {
        for (var i = 2; i < 30; i++) {
            if (box == i) {
                progressbar.style.width = (100 / 14) * i / 2 + "%";
            } else if (box < 2) {
                progressbar.style.width = "0%";
            } else {
                dotImg.classList.remove("active");
            }
        }
    }
    // singleLayout - progressbar
    function singleMode() {
        for (var i = 2; i < 30; i++) {
            if (box == i) {
                progressbarS.style.width = (100 / 28) * (i - 1) + "%";
            } else if (box < 2) {
                progressbarS.style.width = "0%";
            } else {
                dotImgSingle.classList.remove("active");
            }
        }
    }

    // page0 fadeIn & fadeOut
    if (box >= 1) {
        $(".flipcover").fadeOut(0);
    } else {
        $(".flipcover").fadeIn(0);
    }



    if (getOrient()) {
        singleMode();
    } else {
        doubleMode();
    }

    if (landScape()) {
        doubleMode();
    } else {
        singleMode();
    }
    // 마지막 페이지 이벤트
    $(turnEl).bind("last", function () {
        dotImg.classList.add("active");
        dotImgSingle.classList.add("active");
        flipBtnL.style.display = "block";
    })



    if (endPage) {
        flipBtnR.style.display = 'none'
    } else if (beginPage) {
        flipBtnL.style.display = 'none'
        flipBtnR.style.display = 'block'
    } else {
        flipBtnR.style.display = 'block'
        flipBtnL.style.display = 'block'
    }

})




if (getOrient()) { display = "single", pInner.style.display = "none", pInnerSingle.style.display = "flex" }
else {
    display = 'double', pInner.style.display = "flex", pInnerSingle.style.display = "none", $("body .wrap .flipbook .page").css("background", "url('./assets/img/paper.jpg') no-repeat center center / 100% 100%")
}
if (landScape()) {
    pInner.style.display = "flex";
    pInnerSingle.style.display = "none";
} else {
    pInner.style.display = "none";
    pInnerSingle.style.display = "flex";
}
//- ------------------------- resize event ----------------------------
addEventListener('resize', () => {
    turnEl.style.width = ''
    turnEl.style.height = ''
    $(turnEl).turn('size', turnEl.clientWidth, turnEl.clientHeight)
    if (getOrient()) { display = 'single', pInner.style.display = "none", pInnerSingle.style.display = "flex" }
    else { display = 'double', pInner.style.display = "flex", pInnerSingle.style.display = "none", $("body .wrap .flipbook .page").css("background", "url('./assets/img/paper.jpg') no-repeat center center / 100% 100%") }
    if (landScape()) {
        display = 'double';
        pInner.style.display = "flex";
        pInnerSingle.style.display = "none";
    } else {
        pInner.style.display = "none";
        pInnerSingle.style.display = "flex";
    }


    $(turnEl).turn('display', display)

})

//- ------------------------ Keyboard Event ---------------------------
addEventListener('keyup', e => {
    if (e.code == 'ArrowRight') $(turnEl).turn('next')
    else if (e.code == 'ArrowLeft') $(turnEl).turn('previous')
})


//* ===================================================================
//*                             functions                              
//* ===================================================================
//- --------------------------- getOrient -----------------------------
function getOrient() {
    // return window.matchMedia('(orientation: portrait)').matches
    return matchMedia("screen and (max-width:1024px)").matches;
}
function landScape() {
    return window.matchMedia('(orientation: landscape)').matches
}



//- --------------------------- addIframe -----------------------------
function addIframe(file, pageNum) {
    iframeEl = document.querySelector(`.page${pageNum} > .pageWrap > .pageContent > .iframeWrap`)
    iframe = document.createElement('iframe')
    iframe.src = file
    iframe.id = 'iframe' + pageNum
    iframe.style = 'width: 100%; height: 100%;'
    iframe.frameBorder = 0
    iframeEl.appendChild(iframe)
    iframe.onload = () => { }
}

//- --------------------------- outIframe -----------------------------
function outIframe() {
    iframes = document.getElementsByClassName('iframeWrap')
    for (let i of iframes) {
        if (iframeEl) iframeEl = iframeEl.querySelector('iframe')
        if (iframeEl) iframeEl.remove()
    }
}




//* ===================================================================
//*                             variables                              
//* ===================================================================
var duration, display, turnEl, pages, iframes
var iframe, iframeEl




// doubleLayout - progressbar(dotButton)
const dotDouble = document.querySelectorAll(".dot");
dotDouble.forEach(function (e) {
    e.addEventListener("click", function () {
        $(turnEl).turn("page", this.dataset.even);
        console.log(this.dataset.even);

        if (lastLang) setTexts(lastLang)
        else setTexts(lang)
    })
})


// singleLayout - progressbar(dotButton)
const dotSingle = document.querySelectorAll(".dot-single");
dotSingle.forEach(function (e) {
    e.addEventListener("click", function () {
        $(turnEl).turn("page", this.dataset.page);
        console.log(this.dataset.page);
        if (lastLang) setTexts(lastLang)
        else setTexts(lang)
    })
})

