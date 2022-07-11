
// 반응형 주소창 미포함 코드
function setScreenSize() {
    let vh = window.innerHeight * 0.01;

    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setScreenSize();
window.addEventListener('resize', () => setScreenSize());


disableScroll = () => {
    document.querySelector('body').addEventListener('touchmove', this.removeEvent, { passive: false });
    document.querySelector('body').addEventListener('onclick', this.removeEvent, { passive: false });
    document.querySelector('body').addEventListener('mousewheel', this.removeEvent, { passive: false });
}

removeEvent = e => {
    e.preventDefault();
    e.stopPropagation();
}

enableScroll = () => {
    document.querySelector('body').removeEventListener('touchmove', this.removeEvent);
    document.querySelector('body').removeEventListener('onclick', this.removeEvent);
    document.querySelector('body').removeEventListener('mousewheel', this.removeEvent);
}
// $(document).ready(function () {
//     $('body').css('height', $(window).height());

//     $(window).resize(function () {
//         var theHeight = $(window).height();
//         $('body').css('height', theHeight);
//     });

// })

// Swiper Slide
var menu = ['', '', '']
var swiper = new Swiper(".mySwiper", {
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    effect: 'fade',
    fadeEffect: {
        crossFade: true
    },
    loop: true,
    speed: 300,
    allowTouchMove: false,

    //swiper button custom 
    pagination: {
        el: '.swiper-pagination',
        clickable: true,

        renderBullet: function (index, className) {
            return `<div class="${className}">${menu[index]}</div>`
        },

    },

    // on: {
    //     activeIndexChange: function () {
    //         if (this.realIndex == 0) {
    //             // document.querySelector(".page06").style.display = "none";

    //         }

    //     }
    // }

});




// tab menu
// const tabBtns = document.querySelectorAll(".tab-btn button");
// const tabContents = document.querySelectorAll(".tab_content");
// tabBtns.forEach(function (e) {
//     e.addEventListener("click", () => {
//         let tabNumber = e.dataset.tabnum;
//         var tabArr = [tabContents, tabBtns];
//         for (let targetEl of tabArr) {
//             activeToggle(targetEl, targetEl);
//         }
//         function activeToggle(removeEl, addEl) {
//             for (var j = 0; j < removeEl.length; j++) {
//                 removeEl[j].classList.remove("active");
//             }
//             addEl[tabNumber - 1].classList.add("active");
//         }
//     })
// })

// swiper prev & next custom
// const swiperPrev = document.querySelectorAll(".swiper-button-prev");
// const swiperNext = document.querySelectorAll(".swiper-button-next");
// const swiperPagination = document.querySelectorAll(".swiper-pagination");
// swiperPagination.forEach(function(e) {
//     const siblingsPrev = e.previousElementSibling;
//     const siblingsNext = siblingsPrev.previousElementSibling;
//     e.append(siblingsPrev,siblingsNext);
// })





// const lang_btn use_btn lang_select 

const page06Bg = document.querySelector(".page06 .pageWrap .pageContent");
const page07Bg = document.querySelector(".page07 .pageWrap .pageContent");
const lnagBtn = document.querySelector(".lang_btn");
// const useBtn = document.querySelector(".use_btn");
const langSelect = document.querySelector(".lang_select");

const btnArr = [lnagBtn, langSelect];
const changeBgArr = [page06Bg, page07Bg];
btnArr.forEach(function (e) {
    e.addEventListener("click", function () {
        if (e == lnagBtn) {
            langSelect.classList.toggle("active");
        } else if (e == langSelect) {
            langSelect.classList.remove("active");
        }
    })
})


// color sketchbook
const sketch_btn = document.querySelectorAll(".sketchbook_btn");
const iframeColor = document.querySelectorAll(".color_iframe");


sketch_btn.forEach(btn => {
    btn.addEventListener("click", function () {
        for (var i = 0; i < iframeColor.length; i++) {
            iframeColor[i].classList.remove("active");
            iframeColor[btn.dataset.colornum].classList.add("active");
        }

        for(var k of sketch_btn) {
            k.classList.remove("active");
            this.classList.add("active");
        }

    })
})





// 공룡 배경음악
const eTarget = [".flipBtnR", ".progressbar-inner", ".progressbar-inner-single"];
eTarget.forEach(test => {
    document.querySelector(test).addEventListener("click", function () {
        audioPlay();
    }, { once: true })
})
window.addEventListener("keyup", function (e) {
    let keyArr = ["ArrowLeft", "ArrowRight"]
    for (var i = 0; i < keyArr.length; i++) {
        if (e.key == keyArr[i]) {
            audioPlay()
        }
    }
}, { once: true })

function audioPlay() {
    var audioBack = document.getElementById('audio_back')
    var sourceBack = document.getElementById('source_back')
    sourceBack.src = `./assets/audio/background.mp3`
    audioBack.load();
    audioBack.play();
}





